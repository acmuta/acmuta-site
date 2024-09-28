"use client";
import React, { useEffect, useState } from "react";

interface GitHubEvent {
  type: string;
  repoName: string;
  repoUrl: string;
  createdDate: string;
  authorName: string;
  authorUrl: string;
  authorImg?: string;
  title?: string;
  state?: string;
  pullRequestTitle?: string;
  reviewState?: string;
  commentBody?: string;
  forkedRepoName?: string;
}

const ContributionsTable: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/github-events");
        const data: GitHubEvent[] = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const difference = Math.abs(now.getTime() - date.getTime());
    const hours = Math.floor(difference / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const renderEventDescription = (event: GitHubEvent) => {
    switch (event.type) {
      case "PushEvent":
        return ` pushed a commit to `;
      case "PullRequestEvent":
        return ` opened a pull request "${event.title}" in `;
      case "IssuesEvent":
        return ` opened an issue "${event.title}" in `;
      case "ForkEvent":
        return ` forked the repository `;
      case "PullRequestReviewEvent":
        return ` reviewed pull request (${event.reviewState}) in `;
      case "PullRequestReviewCommentEvent":
        return ` commented on pull request in `;
      default:
        return ` did something in ${event.repoName}`;
    }
  };

  return (
    <div className="container mx-auto mb-8 p-8">
      <h1 className="text-2xl font-bold my-4">recent contributions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <p>No recent events found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead className=""></thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={event.authorImg}
                      alt={event.authorName}
                      className="w-8 h-8 rounded-full"
                    />
                    <a
                      href={`https://github.com/${event.authorName}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold hover:underline"
                    >
                      @{event.authorName}
                    </a>{" "}
                    {renderEventDescription(event)}{" "}
                    <a
                      href={`https://github.com/${event.repoName}`}
                      className="font-bold hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {event.repoName}
                    </a>
                  </div>{" "}
                </td>
                <td className="px-4 py-2">
                  {formatTimeAgo(event.createdDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ContributionsTable;
