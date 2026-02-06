export interface Note {
    slug: string;
    title: string;
    content: string;
    date: string;
    excerpt?: string;
    topic: string;
}

export interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    type: "file" | "dir";
}

export interface TopicNotes {
    topic: string;
    files: GitHubFile[];
}

export interface CardProps {
    post: Note;
}

