/**
 * Streams an SSE chat response from the routine-pilot-chat edge function.
 * Calls onDelta for each text chunk and reports artifact + report events.
 */
export interface StreamChatResult {
  ok: boolean;
  status: number;
  artifactsCreated: boolean;
  artifactsUpdated: boolean;
  reportEvents: any[];
}

export interface StreamChatCallbacks {
  onDelta?: (chunk: string) => void;
  onArtifactsCreated?: (ids: string[]) => void;
  onArtifactsUpdated?: (ids: string[]) => void;
  onReportData?: (event: any) => void;
}

export async function streamChat(
  body: Record<string, unknown>,
  callbacks: StreamChatCallbacks = {}
): Promise<StreamChatResult> {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/routine-pilot-chat`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok || !resp.body) {
    return { ok: false, status: resp.status, artifactsCreated: false, artifactsUpdated: false, reportEvents: [] };
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let artifactsCreated = false;
  let artifactsUpdated = false;
  const reportEvents: any[] = [];
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json);
        if (parsed.rp_artifacts_created?.length) {
          artifactsCreated = true;
          callbacks.onArtifactsCreated?.(parsed.rp_artifacts_created);
          continue;
        }
        if (parsed.rp_artifacts_updated?.length) {
          artifactsUpdated = true;
          callbacks.onArtifactsUpdated?.(parsed.rp_artifacts_updated);
          continue;
        }
        if (parsed.rp_report_data) {
          reportEvents.push(parsed.rp_report_data);
          callbacks.onReportData?.(parsed.rp_report_data);
          continue;
        }
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) callbacks.onDelta?.(delta);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }

  return { ok: true, status: resp.status, artifactsCreated, artifactsUpdated, reportEvents };
}
