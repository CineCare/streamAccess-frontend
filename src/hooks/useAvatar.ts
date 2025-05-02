import { useSelector, useDispatch } from "react-redux";
import { RootState, setUserAvatar } from "../providers/store";
import { useEffect } from "react";

export const useAvatar = () => {
	const dispatch = useDispatch();
	const avatar = useSelector((state: RootState) => state.user.avatar);

	useEffect(() => {
		const savedAvatar = localStorage.getItem("userAvatar");
		if (savedAvatar && !avatar) {
			dispatch(setUserAvatar(savedAvatar));
		}
	}, [dispatch, avatar]);

	const updateAvatar = (newAvatarUrl: string) => {
		dispatch(setUserAvatar(newAvatarUrl));
	};

	const getAvatarDisplay = () => {
		return avatar || undefined; // undefined déclenchera l'icône par défaut de MUI Avatar
	};

	return { avatar: getAvatarDisplay(), updateAvatar };
};
