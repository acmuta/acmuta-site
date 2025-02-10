"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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
        return `pushed a commit to`;
      case "PullRequestEvent":
        return `opened a pull request "${event.title}" in`;
      case "IssuesEvent":
        return `opened an issue "${event.title}" in`;
      case "ForkEvent":
        return `forked the repository`;
      case "PullRequestReviewEvent":
        return `reviewed pull request (${event.reviewState}) in`;
      case "PullRequestReviewCommentEvent":
        return `commented on pull request in`;
      default:
        return `did something in ${event.repoName}`;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-2xl font-bold my-4 text-center">
        recent contributions
      </h1>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-center">No recent events found.</p>
      ) : (
        <div className="space-y-4">
          {events
            .filter((event) =>
              [
                "PushEvent",
                "PullRequestEvent",
                "IssuesEvent",
                "ForkEvent",
                "PullRequestReviewEvent",
                "PullRequestReviewCommentEvent",
              ].includes(event.type)
            )
            .map((event, index) => (
              <div
                key={index}
                className="mx-auto w-full sm:w-4/5 md:w-3/4 lg:w-[65%]"
              >
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/40 p-4 flex items-center justify-between">
                  {event.authorImg && (
                    <Image
                      src={event.authorImg}
                      alt={event.authorName}
                      width={40}
                      height={40}
                      className="rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="mx-4 flex-1 text-center whitespace-nowrap overflow-hidden text-ellipsis">
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
                  </div>
                  <div className="text-sm text-gray-300 whitespace-nowrap">
                    {formatTimeAgo(event.createdDate)}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ContributionsTable;
