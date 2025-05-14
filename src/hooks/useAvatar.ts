import { useSelector, useDispatch } from "react-redux";
import { RootState, setUserAvatar } from "../providers/store";

export const useAvatar = () => {
	const dispatch = useDispatch();
	const avatar = useSelector((state: RootState) => state.user.avatar);

	const updateAvatar = (newAvatarUrl: string) => {
		dispatch(setUserAvatar(newAvatarUrl));
	};

	const getAvatarDisplay = () => {
		// Si avatar existe, retourne l'URL complète comme dans la page profil
		if (avatar) {
			const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3100";
			return `${backendUrl}/assets/user_avatars/${avatar}`;
		}
		return undefined; // undefined déclenchera l'icône par défaut de MUI Avatar
	};

	return { avatar: getAvatarDisplay(), updateAvatar };
};
