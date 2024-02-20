import { useEffect } from "react";
import { CAPTCHA_ENABLED, CAPTCHA_KEY } from "../../config";

export const Captcha = ({ onChange }) => {
	const turnstile = window.turnstile;

	useEffect(() => {
		if (turnstile != null) {
			const widgetId = turnstile.render("#captcha-container", {
				sitekey: CAPTCHA_KEY,
				theme: "light",
				callback: (token) => {
					onChange(token);
				},
			});
			const expiryInterval = setInterval(() => {
				turnstile.reset(widgetId);
				onChange(null);
			}, 1 * 60 * 1000);
			return () => {
				clearInterval(expiryInterval);
				turnstile.remove(widgetId);
			};
		}
	}, [turnstile]);

	return (
		<div
			style={{
				display: CAPTCHA_ENABLED === "true" ? "block" : "none",
			}}>
			<div className="cf-turnstile" id="captcha-container" />
		</div>
	);
};
