export function useCopy() {
	const toast = useToast();

	const copyText = async (text: string) => {
		try {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(text);
				toast.add({
					title: "Thành công",
					description: "Đã copy vào clipboard!",
					color: "success",
				});
				return;
			}
			throw new Error("Clipboard API không khả dụng");
		}
		catch (err) {
			try {
				const textarea = document.createElement("textarea");
				textarea.value = text;
				textarea.style.position = "fixed";
				textarea.style.opacity = "0";
				document.body.appendChild(textarea);
				textarea.focus();
				textarea.select();
				const success = document.execCommand("copy");
				document.body.removeChild(textarea);

				if (success) {
					toast.add({
						title: "Thành công",
						description: "Đã copy vào clipboard!",
						color: "success",
					});
				}
				else {
					throw new Error("Không thể copy bằng execCommand");
				}
			}
			catch (fallbackErr) {
				toast.add({
					title: "Lỗi",
					description: "Không thể copy. Vui lòng thử lại.",
					color: "error",
				});
			}
		}
	};

	return { copyText };
}
