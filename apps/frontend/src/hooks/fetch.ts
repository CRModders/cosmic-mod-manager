export default function useFetch(url: string | Request | URL, init?: FetchRequestInit | undefined) {
	return fetch(`${process.env.VITE_SERVER_URL}${url}`, {
		...init,
		credentials: "same-origin",
	});
}
