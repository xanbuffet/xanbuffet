export interface User {
	id: number;
	name: string;
	username: string;
	address: string | null;
}

export interface LoginForm {
	username: string;
	password: string;
}

export interface SignupForm {
	name: string;
	username: string;
	password: string;
	password_confirmation: string;
}

export interface AuthResponse {
	message: string;
	data: {
		id: number;
		name: string;
		username: string;
		address: string | null;
	};
}

export interface Dish {
	id: number;
	name: string;
	image: string;
	selected: boolean;
}

export interface Menu {
	data: {
		name: string;
		day_of_week: string;
		dishes: Dish[];
	};
}

export interface ApiErrorResponse {
	message: string;
}

export interface SimpleTab {
	value: number;
	label: string;
}

export interface Order {
	type: "guest" | "user";
	guest_name: string;
	guest_phone: string;
	address: string;
	notes: string;
	dishes: number[][];
}
