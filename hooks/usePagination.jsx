import { useState, useEffect, useCallback } from "react";
import apiFetch from "../services/apiFetch";
import { usePeople } from "../contexts/peopleContext";

const initialData = {
  data: [],
  totalResult: 0,
  pageNo: 1,
  totalPages: 1,
  status: true,
};

const usePagination = () => {
  const [initialLoader, setInitialLoader] = useState(true);
  const [data, setData] = useState(initialData.data);
  const [totalResult, setTotalResult] = useState(initialData.totalResult);
  const [pageNo, setPageNo] = useState(initialData.pageNo);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const { people, setPeople } = usePeople();

  const fetchData = async (page, perPage = 10) => {
    try {
      const res = await apiFetch("https://swapi.dev/api/people/", {
        key: "page",
        value: page,
      });
      const resultOld = await res.json();

      const result = {
        data: resultOld.results,
        totalResult: resultOld.count,
        status: true,
        pageNo: page,
        totalPages: Math.ceil(resultOld.count / perPage),
      };
      if (page) {
        setPeople(result.data);
      } else {
        setPeople([...people, ...result.data]);
      }
      setData(page === 1 ? result.data : [...data, ...result.data]);
      setTotalResult(result.totalResult);
      setPageNo(result.pageNo);
      setTotalPages(result.totalPages);
    } catch {
      return {
        fetchError:
          "There was an issue fetching the data. Please try again later.",
        handleRefresh,
      };
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
      setInitialLoader(false);
    }
  };

  useEffect(() => {
    fetchData(pageNo);
  }, []);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData(1);
  }, []);

  const loadNextPage = () => {
    if (!loadingMore && pageNo < totalPages) {
      setLoadingMore(true);
      fetchData(pageNo + 1);
    }
  };

  return {
    data,
    totalResult,
    refreshing,
    loadingMore,
    handleRefresh,
    loadNextPage,
    initialLoader,
    fetchError: "",
  };
};

export default usePagination;
