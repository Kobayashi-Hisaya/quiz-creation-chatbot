export async function requestAssessment(spreadsheetId: string, problemId?: string, userId?: string) {
	const res = await fetch('/api/agent-assessment', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ spreadsheetId, problemId, userId }),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Assessment request failed: ${res.status} ${text}`);
	}

	const json = await res.json();
	if (!json.success) {
		throw new Error(json.error || 'Assessment service returned failure');
	}

	return json.diagnosis as string;
}

export default { requestAssessment };
