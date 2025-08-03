-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "whopUserId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "goals" TEXT[],
    "skills" TEXT[],
    "location" TEXT,
    "experience" INTEGER,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Match" (
    "id" TEXT NOT NULL,
    "user1Id" TEXT NOT NULL,
    "user2Id" TEXT NOT NULL,
    "compatibility" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MatchingPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "interests" TEXT[],
    "experienceRange" TEXT,
    "locationRadius" INTEGER,
    "ageRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MatchingPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Connection" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "connectionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "interactionLevel" TEXT NOT NULL,
    "collaborationStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Connection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CommunitySettings" (
    "id" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "matchingEnabled" BOOLEAN NOT NULL DEFAULT true,
    "customFields" JSONB,
    "filters" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunitySettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_whopUserId_key" ON "public"."User"("whopUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchingPreferences_userId_key" ON "public"."MatchingPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Connection_matchId_key" ON "public"."Connection"("matchId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunitySettings_communityId_key" ON "public"."CommunitySettings"("communityId");

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Match" ADD CONSTRAINT "Match_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MatchingPreferences" ADD CONSTRAINT "MatchingPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Connection" ADD CONSTRAINT "Connection_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "public"."Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
