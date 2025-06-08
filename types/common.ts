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

export interface MenuResponse {
	data: {
		status: string;
		dishes: Dish[];
	};
}

export interface ApiErrorResponse {
	message: string;
}
