const BASE = '/api';

export default async function request(path, {
    method: 'GET',
    body,
    token
} = {}) {
    const headers = {};
    if (body) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(BASE + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const message = await res.text();
        throw new Error(message || `Request failed with ${res.status}`);
    }

    // Auth routes return token string; everything else returns JSON
    const type = res.headers.get('Content-Type') ?? '';
    return type.includes('application/json') ? res.json() : res.text();
}
