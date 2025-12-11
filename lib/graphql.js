const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

class UnraidGraphQLClient {
  constructor({ baseUrl, apiKey }) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
  }

  async request(query, variables = {}) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Unraid API error ${res.status}: ${text}`);
    }

    const payload = await res.json();
    if (payload.errors && payload.errors.length) {
      throw new Error(payload.errors.map(e => e.message).join('; '));
    }
    return payload.data;
  }
}

module.exports = UnraidGraphQLClient;

