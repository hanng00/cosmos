"use client";

import { useParams } from "next/navigation";
import { BrandDashboard } from "@/features/brands/components/BrandDashboard";
import { useBrand, useRenameBrand, useBrandPosts } from "@/features/brands/hooks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

      <div className="mt-8 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Posts</h2>
        {postsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">Loading posts…</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {(postsQuery.data?.items ?? []).length === 0 ? (
              <Card className="col-span-full">
                <CardHeader>
                  <CardTitle>No posts yet</CardTitle>
                  <CardDescription>
                    Generate your first post from a URL to see it here.
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              (postsQuery.data?.items ?? []).map((post) => (
                <Card key={post.postId} className="overflow-hidden">
                  <div className="aspect-video bg-muted" style={{ backgroundImage: post.thumbnailUrl ? `url(${post.thumbnailUrl})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-3">
                      <CardTitle className="text-base truncate">{post.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0 capitalize">{post.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt ?? ""}</p>
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


