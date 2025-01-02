import type { Prisma } from "@prisma/client";
import { cacheKey } from "~/services/cache/utils";
import prisma from "~/services/prisma";
import redis from "~/services/redis";
import { USER_DATA_CACHE_KEY } from "~/types/namespaces";
import { GetData_FromCache, USER_DATA_CACHE_EXPIRY_seconds } from "./_cache";

const USER_DATA_SELECT_FIELDS = {
    id: true,
    name: true,
    email: true,
    avatar: true,
    userName: true,
    dateJoined: true,
    emailVerified: true,
    role: true,
    bio: true,
    password: true,
    newSignInAlerts: true,
} satisfies Prisma.UserSelect;

export type GetUser_ReturnType = Awaited<ReturnType<typeof GetUser_FromDb>>;
async function GetUser_FromDb(userName?: string, id?: string) {
    if (!userName && !id) throw new Error("Either userName or id is required!");

    let data = undefined;
    // If both id and slug are provided, check if any table matches either one
    if (id && userName) {
        data = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: id },
                    {
                        userName: {
                            equals: userName,
                            mode: "insensitive",
                        },
                    },
                ],
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    } else if (id) {
        data = await prisma.user.findUnique({
            where: {
                id: id,
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    } else {
        data = await prisma.user.findFirst({
            where: {
                userName: {
                    equals: userName,
                    mode: "insensitive",
                },
            },
            select: USER_DATA_SELECT_FIELDS,
        });
    }

    return data;
}

export async function GetUser_ByIdOrUsername(userName?: string, id?: string) {
    if (!userName && !id) throw new Error("Either userName or id is required!");

    const cachedData = await GetData_FromCache<GetUser_ReturnType>(USER_DATA_CACHE_KEY, userName?.toLowerCase() || id);
    if (cachedData) return cachedData;

    const user = await GetUser_FromDb(userName, id);
    if (user) await Set_UserCache(user);

    return user;
}

export async function GetManyUsers_ByIds(userIds: string[]) {
    const UserIds_RetrievedFromCache: string[] = [];
    const cachedUsers = [];

    {
        const _cachedUsers_promises: Promise<GetUser_ReturnType>[] = [];
        for (const id of userIds) {
            const cachedUser = GetData_FromCache<GetUser_ReturnType>(USER_DATA_CACHE_KEY, id);
            _cachedUsers_promises.push(cachedUser);
        }

        const _cachedUsers = await Promise.all(_cachedUsers_promises);
        for (let i = 0; i < _cachedUsers.length; i++) {
            const _user = _cachedUsers[i];
            if (!_user) continue;

            cachedUsers.push(_user);
            UserIds_RetrievedFromCache.push(_user.id);
        }
    }

    const UserIds_ToFetchFromDb = userIds.filter((id) => !UserIds_RetrievedFromCache.includes(id));
    if (UserIds_ToFetchFromDb.length === 0) return cachedUsers;

    const Users = await prisma.user.findMany({
        where: {
            id: {
                in: UserIds_ToFetchFromDb,
            },
        },
        select: USER_DATA_SELECT_FIELDS,
    });

    {
        const _Set_UserCache_promises = [];
        for (const user of Users) {
            _Set_UserCache_promises.push(Set_UserCache(user));
        }

        await Promise.all(_Set_UserCache_promises);
    }

    return Users.concat(cachedUsers);
}

export function GetUser_Unique<T extends Prisma.UserFindUniqueArgs>(args: Prisma.SelectSubset<T, Prisma.UserFindUniqueArgs>) {
    return prisma.user.findUnique(args);
}

export function GetUser_First<T extends Prisma.UserFindFirstArgs>(args: Prisma.SelectSubset<T, Prisma.UserFindFirstArgs>) {
    return prisma.user.findFirst(args);
}

export function CreateUser<T extends Prisma.UserCreateArgs>(args: Prisma.SelectSubset<T, Prisma.UserCreateArgs>) {
    return prisma.user.create(args);
}

export async function UpdateUser<T extends Prisma.UserUpdateArgs>(args: Prisma.SelectSubset<T, Prisma.UserUpdateArgs>) {
    const user = await prisma.user.update(args);
    if (user) await Delete_UserCache(user.id, user.userName);
    return user;
}

// Cache functions
export async function Delete_UserCache(id: string, _userName?: string) {
    let UserName: string | undefined = _userName;

    // If userName is not provided, get it from the cache
    if (!UserName) {
        UserName = (await redis.get(cacheKey(id, USER_DATA_CACHE_KEY))) || "";
    }

    return await redis.del([cacheKey(id, USER_DATA_CACHE_KEY), cacheKey(UserName.toLowerCase(), USER_DATA_CACHE_KEY)]);
}

interface SetCache_Data {
    id: string;
    userName: string;
}
async function Set_UserCache<T extends SetCache_Data | null>(user: T) {
    if (!user?.id) return;
    const json_string = JSON.stringify(user);

    const p1 = redis.set(cacheKey(user.id, USER_DATA_CACHE_KEY), user.userName.toLowerCase(), "EX", USER_DATA_CACHE_EXPIRY_seconds);
    const p2 = redis.set(cacheKey(user.userName.toLowerCase(), USER_DATA_CACHE_KEY), json_string, "EX", USER_DATA_CACHE_EXPIRY_seconds);
    await Promise.all([p1, p2]);
}
