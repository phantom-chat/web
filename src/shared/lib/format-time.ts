export function formatTime(timestamp: Date | number): string {
	const date = new Date(timestamp);

	let hours = date.getHours();
	const minutes = date.getMinutes();

	const period = hours >= 12 ? "PM" : "AM";

	hours = hours % 12;
	hours = hours ? hours : 12;

	const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

	const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;

	return `${hoursStr}:${minutesStr} ${period}`;
}
