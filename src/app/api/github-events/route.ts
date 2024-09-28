import { NextResponse } from "next/server";

const GITHUB_ORG = "acmuta";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

export async function GET() {
  const headers = {
    Authorization: `token ${GITHUB_TOKEN}`,
  };

  try {
    // Fetching organization events
    const eventsResponse = await fetch(
      `https://api.github.com/orgs/${GITHUB_ORG}/events?per_page=100`,
      { headers }
    );

    if (!eventsResponse.ok) {
      console.error(
        "Failed to fetch organization events:",
        eventsResponse.status,
        eventsResponse.statusText
      );
      return NextResponse.json(
        { message: "Error fetching organization events" },
        { status: 500 }
      );
    }

    const events = await eventsResponse.json();

    // Mapping event data to a structured format
    const mappedEvents = events.map((event: any) => {
      let eventData: any = {
        type: event.type,
        repoName: event.repo.name,
        repoUrl: event.repo.url,
        createdDate: event.created_at,
      };

      // Handling different event types
      if (event.type === "PushEvent") {
        eventData = {
          ...eventData,
          authorName: event.actor.login,
          authorUrl: event.actor.html_url,
        };
      } else if (event.type === "PullRequestEvent") {
        eventData = {
          ...eventData,
          title: event.payload.pull_request.title,
          state: event.payload.pull_request.state,
          authorName: event.payload.pull_request.user.login,
          authorUrl: event.payload.pull_request.user.html_url,
        };
      } else if (event.type === "IssuesEvent") {
        eventData = {
          ...eventData,
          title: event.payload.issue.title,
          state: event.payload.issue.state,
          authorName: event.payload.issue.user.login,
          authorUrl: event.payload.issue.user.html_url,
        };
      } else if (event.type === "ForkEvent") {
        eventData = {
          ...eventData,
          forkedRepoName: event.payload.forkee.full_name,
          forkedRepoUrl: event.payload.forkee.html_url,
          authorName: event.actor.login,
          authorUrl: event.actor.html_url,
        };
      } else if (event.type === "PullRequestReviewEvent") {
        eventData = {
          ...eventData,
          reviewState: event.payload.review.state,
          pullRequestTitle: event.payload.pull_request.title,
          pullRequestUrl: event.payload.pull_request.html_url,
          authorName: event.actor.login,
          authorUrl: event.actor.html_url,
        };
      } else if (event.type === "PullRequestReviewCommentEvent") {
        eventData = {
          ...eventData,
          commentBody: event.payload.comment.body,
          pullRequestTitle: event.payload.pull_request.title,
          pullRequestUrl: event.payload.pull_request.html_url,
          authorName: event.actor.login,
          authorUrl: event.actor.html_url,
        };
      }

      return eventData;
    });

    // Sort events by date in descending order
    const sortedEvents = mappedEvents.sort(
      (a: any, b: any) =>
        new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    );

    // Remove duplicates based on title/message, repoName, and createdDate
    const uniqueEvents = Array.from(
      new Map(
        sortedEvents.map((event: any) => [
          `${event.title || event.message}|${event.repoName}|${
            event.createdDate
          }`,
          event,
        ])
      ).values()
    );

    // Take the latest 20 unique events
    const latestEvents = uniqueEvents.slice(0, 20);

    return NextResponse.json(latestEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Error fetching events", error: (error as Error).message },
      { status: 500 }
    );
  }
}
