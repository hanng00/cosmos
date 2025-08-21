"use client";

import { useParams } from "next/navigation";
import { BrandDashboard } from "@/features/brands/components/BrandDashboard";
import { CreatePostDialog } from "@/features/brands/components/CreatePostDialog";
import {
  useBrand,
  useRenameBrand,
  useBrandPosts,
} from "@/features/brands/hooks";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Loader2 } from "lucide-react";

export default function BrandDetailPage() {
  const params = useParams<{ brandId: string }>();
  const brandId = params.brandId;
  const brandQuery = useBrand(brandId);
  const rename = useRenameBrand(brandId);
  const postsQuery = useBrandPosts(brandId);

  return (
    <div className="p-6">
      <BrandDashboard
        brand={brandQuery.data}
        isLoading={brandQuery.isLoading}
        onRename={async (name) => {
          await rename.mutateAsync(name);
          await brandQuery.refetch();
        }}
      />

      <div className="mt-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-muted-foreground">Posts</h2>
          <CreatePostDialog
            brandId={brandId}
            trigger={
              <Button size="sm">
                Generate Content
              </Button>
            }
          />
        </div>

        {postsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading posts…</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-h-[10rem]">
            {(postsQuery.data?.items ?? []).length === 0 ? (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No posts yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <p className="text-sm text-muted-foreground">
                      Create your first post to get started.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              (postsQuery.data?.items ?? []).map((post) => (
                <Card key={post.postId} className="overflow-hidden">
                  <div
                    className="aspect-video bg-muted flex items-center justify-center"
                    style={{
                      backgroundImage: post.thumbnailUrl
                        ? `url(${post.thumbnailUrl})`
                        : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    {post.status === "generating" && (
                      <div className="flex items-center gap-2 text-white bg-black/50 px-3 py-1 rounded-full">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Generating...</span>
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base truncate">
                        {post.status === "generating"
                          ? "Generating content..."
                          : post.title}
                      </CardTitle>
                      <Badge
                        variant={
                          post.status === "generating"
                            ? "default"
                            : "secondary"
                        }
                        className={`shrink-0 capitalize text-xs ${
                          post.status === "generating" ? "animate-pulse" : ""
                        }`}
                      >
                        {post.status === "generating" && (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        )}
                        {post.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.status === "generating"
                        ? "AI is creating optimized content for your post..."
                        : post.excerpt ?? ""}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
