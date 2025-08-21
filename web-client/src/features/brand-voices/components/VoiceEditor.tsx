"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import TagsInput from "@/components/ui/TagsInput";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BrandVoiceSchema } from "../validation";
import { type BrandVoice as ApiBrandVoice } from "../api";
import { Textarea } from "@/components/ui/textarea";

interface VoiceEditorProps {
  voice: ApiBrandVoice;
  onChange: (v: ApiBrandVoice) => void;
}

type FormData = z.infer<typeof BrandVoiceSchema>;

const RowFormItem = ({
  label,
  controlChildren,
}: {
  label: string;
  controlChildren: React.ReactNode;
}) => (
  <FormItem>
    <div className="grid grid-cols-[5rem_1fr] gap-2">
      <FormLabel className="text-foreground/70 font-normal text-xs place-self-start pt-2">
        {label}
      </FormLabel>
      <FormControl>{controlChildren}</FormControl>
    </div>
    <FormMessage />
  </FormItem>
);

export function VoiceEditor({ voice, onChange }: VoiceEditorProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(BrandVoiceSchema),
    defaultValues: voice,
    mode: "onChange",
  });

  // Watch for form changes and propagate them up
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      // Only call onChange if the form is valid and values have actually changed
      if (form.formState.isValid && value !== voice) {
        onChange(value as ApiBrandVoice);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, onChange, voice]);

  // Update form when voice prop changes (external updates)
  React.useEffect(() => {
    form.reset(voice);
  }, [voice, form]);

  return (
    <Form {...form}>
      <form className="grid gap-6 py-2">
        {/* FIRST SECTION */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter brand voice name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6">
          <FormLabel>Modify your Brand Voice</FormLabel>
          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <RowFormItem
                label="Purpose"
                controlChildren={
                  <Textarea
                    placeholder="Describe the purpose of this voice"
                    {...field}
                  />
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="audience"
            render={({ field }) => (
              <RowFormItem
                label="Audience"
                controlChildren={
                  <Textarea
                    placeholder="Describe your target audience"
                    {...field}
                  />
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="tone"
            render={({ field }) => (
              <RowFormItem
                label="Tone"
                controlChildren={
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add tone keywords (e.g., professional, friendly)"
                  />
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="emotion"
            render={({ field }) => (
              <RowFormItem
                label="Emotion"
                controlChildren={
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add emotional keywords (e.g., confident, warm)"
                  />
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="character"
            render={({ field }) => (
              <RowFormItem
                label="Character"
                controlChildren={
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add character traits (e.g., innovative, reliable)"
                  />
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="syntax"
            render={({ field }) => (
              <RowFormItem
                label="Syntax"
                controlChildren={
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add syntax preferences (e.g., short sentences, active voice)"
                  />
                }
              />
            )}
          />

          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <RowFormItem
                label="Language"
                controlChildren={
                  <TagsInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Add language preferences (e.g., technical, conversational)"
                  />
                }
              />
            )}
          />
        </div>
      </form>
    </Form>
  );
}
