import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Divider, Space, Tooltip } from "antd";
import {
	Bold,
	Code,
	Heading1,
	Heading2,
	ImageIcon,
	Italic,
	Link2,
	List,
	ListOrdered,
	Quote,
} from "lucide-react";
import { useRef } from "react";
import { useUploadArticleImage } from "../hooks/useUploadArticleImage";

type ArticleEditorProps = {
	content: string;
	onChange: (html: string) => void;
};

export function ArticleEditor({ content, onChange }: ArticleEditorProps) {
	const { uploadImage } = useUploadArticleImage();
	const fileInputRef = useRef<HTMLInputElement>(null);

	// `content` is only read here, at editor creation — ArticleFormPage
	// gates rendering behind its loading state, so by the time this
	// component first mounts (both create and edit modes), `content`
	// already holds its final initial value. Reacting to further prop
	// changes (e.g. via editor.commands.setContent in an effect) isn't
	// needed and previously crashed under StrictMode's double-effect
	// invocation ("schema is null" — calling editor methods against an
	// instance mid-teardown).
	const editor = useEditor({
		extensions: [StarterKit, Image],
		content,
		onUpdate: ({ editor }) => onChange(editor.getHTML()),
		editorProps: {
			attributes: {
				spellcheck: "false",
			},
		},
	});

	if (!editor) return null;

	const handleImageFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file) return;
		try {
			const url = await uploadImage(file);
			editor.chain().focus().setImage({ src: url }).run();
		} catch {
			// silently ignore, matching the previous behavior on upload failure
		}
	};

	const handleLinkClick = () => {
		const previousUrl = editor.getAttributes("link").href as string | undefined;
		const url = window.prompt("URL", previousUrl || "");
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
	};

	return (
		<div className="rounded-xl border border-sand overflow-hidden bg-white">
			<Space wrap size={4} className="border-b border-sand bg-mist p-2">
				<Tooltip title="Bold">
					<Button
						type={editor.isActive("bold") ? "primary" : "default"}
						icon={<Bold size={14} />}
						onClick={() => editor.chain().focus().toggleBold().run()}
					/>
				</Tooltip>
				<Tooltip title="Italic">
					<Button
						type={editor.isActive("italic") ? "primary" : "default"}
						icon={<Italic size={14} />}
						onClick={() => editor.chain().focus().toggleItalic().run()}
					/>
				</Tooltip>
				<Divider type="vertical" className="mx-0" />
				<Tooltip title="Heading 1">
					<Button
						type={
							editor.isActive("heading", { level: 1 }) ? "primary" : "default"
						}
						icon={<Heading1 size={14} />}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 1 }).run()
						}
					/>
				</Tooltip>
				<Tooltip title="Heading 2">
					<Button
						type={
							editor.isActive("heading", { level: 2 }) ? "primary" : "default"
						}
						icon={<Heading2 size={14} />}
						onClick={() =>
							editor.chain().focus().toggleHeading({ level: 2 }).run()
						}
					/>
				</Tooltip>
				<Divider type="vertical" className="mx-0" />
				<Tooltip title="Bullet list">
					<Button
						type={editor.isActive("bulletList") ? "primary" : "default"}
						icon={<List size={14} />}
						onClick={() => editor.chain().focus().toggleBulletList().run()}
					/>
				</Tooltip>
				<Tooltip title="Numbered list">
					<Button
						type={editor.isActive("orderedList") ? "primary" : "default"}
						icon={<ListOrdered size={14} />}
						onClick={() => editor.chain().focus().toggleOrderedList().run()}
					/>
				</Tooltip>
				<Tooltip title="Quote">
					<Button
						type={editor.isActive("blockquote") ? "primary" : "default"}
						icon={<Quote size={14} />}
						onClick={() => editor.chain().focus().toggleBlockquote().run()}
					/>
				</Tooltip>
				<Tooltip title="Code block">
					<Button
						type={editor.isActive("codeBlock") ? "primary" : "default"}
						icon={<Code size={14} />}
						onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					/>
				</Tooltip>
				<Divider type="vertical" className="mx-0" />
				<Tooltip title="Link">
					<Button
						type={editor.isActive("link") ? "primary" : "default"}
						icon={<Link2 size={14} />}
						onClick={handleLinkClick}
					/>
				</Tooltip>
				<Tooltip title="Insert image">
					<Button
						icon={<ImageIcon size={14} />}
						onClick={() => fileInputRef.current?.click()}
					/>
				</Tooltip>
			</Space>
			<EditorContent
				editor={editor}
				className="prose prose-slate max-w-none prose-p:my-2 prose-li:my-1 prose-ul:my-3 prose-ol:my-3 prose-headings:mt-4 prose-headings:mb-2 p-4 min-h-[300px] focus:outline-none [&_.ProseMirror]:min-h-[280px] [&_.ProseMirror]:outline-none"
			/>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				style={{ display: "none" }}
				onChange={(event) => void handleImageFileChange(event)}
			/>
		</div>
	);
}
