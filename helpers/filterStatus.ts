type FilterStatusItem = {
  name: string;
  status: string;
  class: string;
};

type Query = {
  status?: string;
};

const getFilterStatus = (query: Query): FilterStatusItem[] => {
  const filterStatus: FilterStatusItem[] = [
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

  // Đặt class "active" cho status phù hợp
  if (query.status) {
    const index = filterStatus.findIndex(item => item.status === query.status);
    if (index !== -1) {
      filterStatus[index].class = "active";
    }
  } else {
    const index = filterStatus.findIndex(item => item.status === "");
    if (index !== -1) {
      filterStatus[index].class = "active";
    }
  }

  return filterStatus;
};

export default getFilterStatus;
