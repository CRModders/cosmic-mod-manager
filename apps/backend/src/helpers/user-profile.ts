import prisma from "@/lib/prisma";
import { passwordHashingSaltRounds } from "@root/config";
import UAParser from "ua-parser-js";

// Hash the user password using bcrypt
export const hashPassword = async (password: string) => {
    const hashedPassword = await Bun.password.hash(password, {
        algorithm: "argon2id",
        timeCost: passwordHashingSaltRounds,
    });

    return hashedPassword;
};

// Compare plain text password and the hashed password
export const matchPassword = async (password: string, hash: string) => {
    try {
        return await Bun.password.verify(password, hash, "argon2id");
    } catch (error) {
        return false;
    }
};

export const isUsernameAvailable = async (username: string) => {
    const result = {
        noExistingUser: false,
        noReservedUsername: false,
    };
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                user_name: username,
            },
        });

        if (!existingUser?.id) result.noExistingUser = true;

        const deletedUser = await prisma.deletedUser.findUnique({
            where: {
                user_name: username,
            },
        });

        if (!deletedUser?.id) result.noReservedUsername = true;
    } catch (error) {}

    return result.noExistingUser && result.noReservedUsername;
};

export type GeoApiData = {
    region?: string;
    country?: string;
};

export const getDeviceDetails = async (userAgent: string, ip_addr: string) => {
    const parsedResult = new UAParser(userAgent).getResult();
    const browser = parsedResult.browser.name;
    const os = `${parsedResult.os.name} ${parsedResult.os.version || ""}`;

    const geoData: GeoApiData | null = {};

    // Gettings Geo data from the IP address
    if (ip_addr) {
        try {
            const res = await fetch(`https://ipinfo.io/${ip_addr}?token=${process.env.IP_TO_GEO_API_KEY}`);
            const resJsonData = await res.json();

            if (resJsonData?.city || resJsonData?.region) {
                geoData.region = `${resJsonData?.city} ${resJsonData?.region}`;
            }
            if (resJsonData?.country) {
                geoData.country = resJsonData?.country;
            }
        } catch (error) {
            console.error(error);
        }
    }

    return {
        browser,
        os,
        ip_addr,
        ...geoData,
    };
};
