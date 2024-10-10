CREATE TABLE IF NOT EXISTS "comment_votes" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"commentId" uuid,
	"userId" uuid,
	"type" "userVote" NOT NULL,
	"createdAt" timestamp DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "profilePic" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_commentId_post_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "post_comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
