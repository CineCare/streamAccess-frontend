// src/data/mockBlogPosts.ts
// Liste modifiable de billets de blog pour le mockup

export interface BlogPost {
	id: number;
	title: string;
	author: string;
	date: string;
	content: string;
	image: string; // url ou chemin relatif
	commentsCount: number;
	excerpt: string;
}

export const mockBlogPosts: BlogPost[] = [
	{
		id: 1,
		title: "Pourquoi StreamAccess ?",
		author: "Lisa M.",
		date: "2025-08-01",
		content: `StreamAccess est né de la volonté de rendre le streaming plus accessible et inclusif. Nous avons constaté un manque d'options pour les personnes en situation de handicap et souhaitons offrir une expérience adaptée à tous. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
		image: "/public/images/photo-blog-1.jpg",
		commentsCount: 3,
		excerpt:
			"StreamAccess est né de la volonté de rendre le streaming plus accessible et inclusif. Nous avons constaté un manque d'options pour les personnes en situation de handicap et souhaitons offrir une expérience adaptée à tous.",
	},
	{
		id: 2,
		title: "Les défis techniques du projet",
		author: "Jean Dupont",
		date: "2025-08-10",
		content: `Le développement de StreamAccess a nécessité la mise en place d'une architecture robuste, capable de gérer la vidéo en temps réel et l'accessibilité. Nous partageons ici quelques-uns des choix techniques réalisés. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
		image: "/public/images/photo-blog-2.png",
		commentsCount: 5,
		excerpt:
			"Le développement de StreamAccess a nécessité la mise en place d'une architecture robuste, capable de gérer la vidéo en temps réel et l'accessibilité. Nous partageons ici quelques-uns des choix techniques réalisés.",
	},
	{
		id: 3,
		title: "Nos prochaines étapes",
		author: "Marie Martin",
		date: "2025-08-20",
		content: `L'équipe travaille actuellement sur de nouvelles fonctionnalités, comme l'intégration d'un chatbot et l'amélioration de la personnalisation utilisateur. Restez connectés ! Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
		image: "/public/images/photo-blog-3.jpg",
		commentsCount: 2,
		excerpt: "L'équipe travaille actuellement sur de nouvelles fonctionnalités, comme l'intégration d'un chatbot et l'amélioration de la personnalisation utilisateur. Restez connectés !",
	},
	{
		id: 4,
		title: "L'accessibilité, un engagement quotidien",
		author: "Sophie Bernard",
		date: "2025-08-25",
		content: `Chez StreamAccess, l'accessibilité n'est pas une option mais une priorité.

Chaque jour, nous testons et améliorons nos interfaces avec des utilisateurs en situation de handicap pour garantir une expérience réellement inclusive.

Nous collaborons avec des associations spécialisées et restons à l'écoute de vos retours pour faire évoluer la plateforme.

Notre objectif : que chacun puisse profiter du streaming, sans barrière.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
		image: "/public/images/photo-blog-4.jpg",
		commentsCount: 4,
		excerpt: "L'accessibilité au cœur de StreamAccess : retours d'expérience et engagements concrets de l'équipe. Pour cela, on va avoir besoin de vous !",
	},
];
