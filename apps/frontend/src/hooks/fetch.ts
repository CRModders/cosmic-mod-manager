export default function useFetch(url: string | Request | URL, init?: FetchRequestInit | undefined) {
	return fetch(url, {
		...init,
	});
}
