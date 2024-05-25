-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('ADMIN', 'MODERATOR', 'CREATOR', 'USER');

-- CreateEnum
CREATE TYPE "UserVerificationActionTypes" AS ENUM ('ADD_PASSWORD', 'CHANGE_PASSWORD', 'DELETE_USER_ACCOUNT');

-- CreateEnum
CREATE TYPE "Providers" AS ENUM ('google', 'discord', 'github', 'gitlab');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "providerAccountEmail" TEXT,
    "profileImage" TEXT,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "sessionToken" VARCHAR(255) NOT NULL,
    "createdOn" TIMESTAMP(3),
    "lastUsed" TIMESTAMP(3),
    "browser" VARCHAR(255),
    "os" VARCHAR(255),
    "ipAddr" VARCHAR(255),
    "region" VARCHAR(255),
    "country" VARCHAR(255),
    "provider" VARCHAR(255),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "userName" VARCHAR(255),
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "unverifiedNewPassword" VARCHAR(255),
    "role" "UserRoles" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "profileImageProvider" "Providers",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeletedUser" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "deletionTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeletedUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationEmail" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" "UserVerificationActionTypes" NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DeletedUser_email_key" ON "DeletedUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_userId_key" ON "VerificationEmail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationEmail_token_key" ON "VerificationEmail"("token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationEmail" ADD CONSTRAINT "VerificationEmail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
