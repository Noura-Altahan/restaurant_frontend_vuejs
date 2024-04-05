/*
 * Main and demo navigation arrays
 *
 * 'to' attribute points to the route name, not the path url
 */

export default {
    main: [
        {
            name: "Dashboard",
            to: "backend-dashboard",
            icon: "si si-speedometer",
        },
        {
            name: "Menus Management",
            icon: "fa fa-arrows-to-dot",
            subActivePaths: "/Menus",
            sub: [
                {
                    name: "Menus List",
                    to: "Menus-list",
                },
            ],
        },
        {
            name: "Categories Management",
            icon: "fa fa-arrows-to-dot",
            subActivePaths: "/Categories",
            sub: [
                {
                    name: "Categories List",
                    to: "Categories-list",
                },
            ],
        },
        {
            name: "Sub-Categories Management",
            icon: "fa fa-arrows-to-dot",
            subActivePaths: "/subCategories",
            sub: [
                {
                    name: "Sub-Categories List",
                    to: "subCategories-list",
                },
            ],
        },
        {
            name: "Items Management",
            icon: "fa fa-arrows-to-dot",
            subActivePaths: "/Items",
            sub: [
                {
                    name: "Items List",
                    to: "Items-list",
                },
            ],
        },
    ],
};
