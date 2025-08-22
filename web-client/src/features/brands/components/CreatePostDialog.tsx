"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateBrandPost } from "../hooks";
import { Loader2 } from "lucide-react";

const postSchema = z.object({
  instruction: z.string().min(10, "Instruction must be at least 10 characters"),
});

type PostFormData = z.infer<typeof postSchema>;

interface CreatePostDialogProps {
  brandId: string;
  trigger: React.ReactNode;
}

export function CreatePostDialog({ brandId, trigger }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false);
  const createPost = useCreateBrandPost(brandId);

  const form = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      instruction: "",
    },
  });

  const onSubmit = async (data: PostFormData) => {
    try {
      await createPost.mutateAsync({
        instruction: data.instruction,
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Generate Content with AI
          </DialogTitle>
          <DialogDescription>
            Describe what you want to create and our AI will generate optimized content for you.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="instruction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want to create?</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your content idea... 

Examples:
- Promote our new eco-friendly water bottles
- Share tips for remote work productivity  
- Announce our Black Friday sale
- Create engaging content about our company culture"
                      className="min-h-[140px] resize-none"
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Be specific about your goal, target audience, or key message. The AI will create engaging content optimized for social media. Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createPost.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createPost.isPending}
                className="min-w-[120px]"
              >
                {createPost.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Content
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}