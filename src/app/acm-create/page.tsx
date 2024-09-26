"use client"
import React, { useEffect, useState } from "react";

interface GitHubEvent {
  id: string;
  type: string;
  actor: {
    login: string;
  };
  repo: {
    name: string;
  };
  payload: {
    commits?: { message: string }[];
  };
  created_at: string;
}

const AcmCreatePage: React.FC = () => {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/github-events");
        const data: GitHubEvent[] = await response.json();
        
        // Filter for push events
        const pushEvents = data.filter(event => event.type === "PushEvent");
        setEvents(pushEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="container mx-auto mb-8">
      <h1 className="text-2xl font-bold my-4">recent contributions</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th className="border px-4 py-2">User</th>
              <th className="border px-4 py-2">Repository</th>
              <th className="border px-4 py-2">Commit Message</th>
              <th className="border px-4 py-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td className="border px-4 py-2">{event.actor.login}</td>
                <td className="border px-4 py-2">{event.repo.name}</td>
                <td className="border px-4 py-2">
                  {event.payload.commits?.[0]?.message || "No commit message"}
                </td>
                <td className="border px-4 py-2">
                  {new Date(event.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AcmCreatePage;
