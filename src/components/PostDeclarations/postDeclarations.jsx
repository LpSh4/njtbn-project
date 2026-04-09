import "./postDeclarations.scss";
import { useEffect, useState, useContext } from "react";
import { PostDeclarationsFilter } from "../PostDeclarationsFilter/PostDeclarationsFilter.jsx";
import { PostDeclarationsCard } from "../PostDeclarationsCard/PostDeclarationsCard.jsx";
import { api } from "../../api/axios";
import { AuthContext } from "../../context/AuthContext.jsx";

export const PostDeclarations = ({ type }) => {
    const { role } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const endpoint = type === "resume" ? "/resumes/search" : "/vacancies/search";

    const fetchDeclarations = async (filters = {}, pageNumber = 1) => {
        setLoading(true);
        try {
            const res = await api.get(endpoint, { params: { ...filters, page: pageNumber } });

            if (res?.data?.data) {
                setPosts(res.data.data);
                setPage(res.data.meta?.page || 1);
                setLastPage(res.data.meta?.lastPage || 1);
            } else {
                setPosts([]);
            }
        } catch (err) {
            console.error("Error fetching declarations:", err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeclarations({}, 1);
    }, [endpoint]);

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > lastPage) return;
        fetchDeclarations({}, newPage);
    };

    return (
        <section className="declaration">
            <aside className="declaration__filter">
                <PostDeclarationsFilter
                    onSubmit={(filters) => fetchDeclarations(filters, 1)}
                    type={type}
                />
            </aside>

            <section className="declaration__content">
                <div className="declaration__search">
                    <input placeholder="Enter keywords" type="search" />
                </div>

                <section className="declaration__post">
                    {loading ? (
                        <p>Loading...</p>
                    ) : posts.length === 0 ? (
                        <p>No {type === "resume" ? "resumes" : "vacancies"} found</p>
                    ) : (
                        posts.map((item) => (
                            <PostDeclarationsCard
                                key={item.id}
                                data={item}
                                type={type}
                                role={role}
                            />
                        ))
                    )}
                </section>

                {lastPage > 1 && (
                    <div className="pagination">
                        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                            Prev
                        </button>
                        <span>
                            {page} / {lastPage}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === lastPage}
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
        </section>
    );
};