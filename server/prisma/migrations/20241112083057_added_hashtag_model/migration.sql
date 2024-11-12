-- CreateTable
CREATE TABLE "Hashtag" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Hashtag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_hashtag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Hashtag_text_key" ON "Hashtag"("text");

-- CreateIndex
CREATE UNIQUE INDEX "_hashtag_AB_unique" ON "_hashtag"("A", "B");

-- CreateIndex
CREATE INDEX "_hashtag_B_index" ON "_hashtag"("B");

-- AddForeignKey
ALTER TABLE "_hashtag" ADD CONSTRAINT "_hashtag_A_fkey" FOREIGN KEY ("A") REFERENCES "Hashtag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hashtag" ADD CONSTRAINT "_hashtag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tweet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
