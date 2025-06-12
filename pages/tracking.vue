<script setup lang="ts">
import { z } from "zod";

const schema = z.object({
	username: z.string().regex(/^[0-9]{10}$/, "Số điện thoại phải có 10 chữ số"),
	order_no: z.string().min(12, "Mã đơn hàng phải có ít nhất 12 ký tự"),
});
const form = ref({ username: "", order_no: "" });
</script>

<template>
	<UContainer class="my-5 md:my-10">
		<UForm
			:schema="schema"
			:state="form"
			class="w-full max-w-3xl mx-auto flex flex-col md:flex-row items-baseline justify-center space-y-4 md:space-x-4 md:space-y-0"
		>
			<UFormField
				name="username"
				type="tel"
				required
			>
				<UInput
					v-model="form.username"
					icon="i-lucide-phone"
					placeholder=""
					:ui="{ base: 'peer' }"
				>
					<label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium pl-7 pr-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
						<span class="inline-flex bg-default px-1">Số điện thoại</span>
					</label>
				</UInput>
			</UFormField>
			<UFormField
				name="order_no"
				required
			>
				<UInput
					v-model="form.order_no"
					placeholder=""
					:ui="{ base: 'peer' }"
				>
					<label class="pointer-events-none absolute left-0 -top-2.5 text-highlighted text-xs font-medium px-1.5 transition-all peer-focus:-top-2.5 peer-focus:text-highlighted peer-focus:text-xs peer-focus:font-medium peer-placeholder-shown:text-sm peer-placeholder-shown:text-dimmed peer-placeholder-shown:top-1.5 peer-placeholder-shown:font-normal">
						<span class="inline-flex bg-default px-1">Mã đơn hàng</span>
					</label>
				</UInput>
			</UFormField>
			<UButton
				trailing-icon="i-lucide:package-search"
				type="submit"
			>
				Kiểm Tra
			</UButton>
		</UForm>
	</UContainer>
</template>
