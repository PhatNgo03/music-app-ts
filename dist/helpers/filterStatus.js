"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getFilterStatus = (query) => {
    const filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];
    if (query.status) {
        const index = filterStatus.findIndex(item => item.status === query.status);
        if (index !== -1) {
            filterStatus[index].class = "active";
        }
    }
    else {
        const index = filterStatus.findIndex(item => item.status === "");
        if (index !== -1) {
            filterStatus[index].class = "active";
        }
    }
    return filterStatus;
};
exports.default = getFilterStatus;
