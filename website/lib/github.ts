import { GitHubFile, TopicNotes } from "@/types";

const OWNER = process.env.GITHUB_OWNER ?? "ppriyankuu";
const REPO = process.env.GITHUB_REPO ?? "doc";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const BRANCH = "main";

async function fetchRepoPath(path = ""): Promise<GitHubFile[]> {
    const url = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`;

    const headers: HeadersInit = {
        Accept: "application/vnd.github.v3+json",
    };

    // Add Authorization header if token exists
    if (GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    }

    const res = await fetch(url, { headers });

    if (!res.ok) {
        console.error(`GitHub API Error for ${path}:`, res.status, res.statusText);
        const errorText = await res.text();
        console.error("Error details:", errorText);
        throw new Error(`Failed to fetch ${path}: ${res.status} ${res.statusText}`);
    }

    return res.json();
}

export async function fetchTopicsWithNotes(): Promise<TopicNotes[]> {
    try {
        console.log(`Fetching from GitHub: ${OWNER}/${REPO}`);

        const rootItems = await fetchRepoPath();
        console.log(`Found ${rootItems.length} items at root`);

        // Only directories = topics
        const topicDirs = rootItems.filter(
            (item) => item.type === "dir"
        );
        console.log(`Found ${topicDirs.length} topic directories`);

        const topics: TopicNotes[] = [];

        for (const dir of topicDirs) {
            console.log(`Processing directory: ${dir.name}`);
            const items = await fetchRepoPath(dir.path);

            const markdownFiles = items.filter(
                (item) =>
                    item.type === "file" &&
                    item.name.endsWith(".md")
            );

            console.log(`Found ${markdownFiles.length} markdown files in ${dir.name}`);

            if (markdownFiles.length > 0) {
                topics.push({
                    topic: dir.name,
                    files: markdownFiles,
                });
            }
        }

        console.log(`Total topics with markdown files: ${topics.length}`);
        return topics;
    } catch (error) {
        console.error("Error in fetchTopicsWithNotes:", error);
        throw error;
    }
}

export async function fetchMarkdownContent(filePath: string): Promise<string> {
    const response = await fetch(
        `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${filePath}`
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`);
    }

    return response.text();
}
