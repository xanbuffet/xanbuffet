export interface User {
	id: number;
	name: string;
	username: string;
	address: string | null;
	orders_count: number | null;
}

export interface UserResponse {
	data: User;
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
		orders_count: number;
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

export interface OrderPayload {
	type: "guest" | "user";
	guest_name: string;
	guest_phone: string;
	address: string;
	notes: string;
	dishes: number[][];
}

export interface Order {
	id: number;
	order_no: string;
	user_id: number | null;
	guest_name: string | null;
	guest_phone: string | null;
	total_price: number;
	address: string;
	notes: string | null;
	status: "pending" | "processing" | "completed" | "cancelled" | "shipping";
	created_at: string;
	updated_at: string;
	dishes: {
		id: number;
		name: string;
		image: string;
		meal_number: number;
	}[];
}

export interface OrderResponse {
	message: string;
	order: Order[];
}
