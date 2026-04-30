import { useEffect, useMemo, useState } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

type ReservationStatus = "pending" | "confirmed" | "cancelled";

type Reservation = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  car: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  message: string | null;
  status: ReservationStatus;
  source: string;
  created_at: string;
};

const STORAGE_KEY = "ritcars_admin_token";

const statusOptions: ReservationStatus[] = ["pending", "confirmed", "cancelled"];

const statusClasses: Record<ReservationStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  confirmed: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function escapeCsvValue(value: string | null | undefined) {
  const normalizedValue = value ?? "";
  const formulaSafeValue = /^[=+\-@]/.test(normalizedValue)
    ? `'${normalizedValue}`
    : normalizedValue;
  const escapedValue = formulaSafeValue.replace(/"/g, '""');
  return `"${escapedValue}"`;
}

export default function AdminReservationsPage() {
  const apiBaseUrl = useMemo(() => {
    const configuredUrl = import.meta.env.VITE_API_BASE_URL?.trim();

    if (import.meta.env.DEV && configuredUrl) {
      return configuredUrl;
    }

    return "";
  }, []);

  const listEndpoint = useMemo(() => {
    if (apiBaseUrl) {
      return `${apiBaseUrl}/api/admin/reservations`;
    }

    return "/api/admin/reservations";
  }, [apiBaseUrl]);

  const statusEndpoint = useMemo(() => {
    if (apiBaseUrl) {
      return `${apiBaseUrl}/api/admin/reservations/status`;
    }

    return "/api/admin/reservations/status";
  }, [apiBaseUrl]);

  const deleteEndpoint = useMemo(() => {
    if (apiBaseUrl) {
      return `${apiBaseUrl}/api/admin/reservations/delete`;
    }

    return "/api/admin/reservations/delete";
  }, [apiBaseUrl]);

  const [adminToken, setAdminToken] = useState("");
  const [inputToken, setInputToken] = useState("");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const savedToken = sessionStorage.getItem(STORAGE_KEY);

    if (savedToken) {
      setAdminToken(savedToken);
      setInputToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!adminToken) {
      return;
    }

    const loadReservations = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(listEndpoint, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data?.success) {
          let errorMsg = data?.error || "Impossible de charger les reservations.";
          
          if (response.status === 401) {
            errorMsg = "Cle d'administration invalide. Veuillez entrer la bonne cle.";
          } else if (response.status === 404) {
            errorMsg = "Le serveur API n'est pas disponible. Verifiez que le serveur backend est lance.";
          } else if (response.status === 500 && errorMsg.includes("Supabase")) {
            errorMsg = "Configuration Supabase manquante. Contactez l'administrateur pour configurer l'acces a la base de donnees.";
          }
          
          throw new Error(errorMsg);
        }

        setReservations(Array.isArray(data.reservations) ? data.reservations : []);
      } catch (fetchError) {
        setReservations([]);
        let errorMsg = "Erreur inconnue lors du chargement.";
        
        if (fetchError instanceof TypeError) {
          errorMsg = "Impossible de se connecter au serveur. Verifiez que le backend est lance.";
        } else if (fetchError instanceof Error) {
          errorMsg = fetchError.message;
        }
        
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, [adminToken, listEndpoint, retryCount]);

  const filteredReservations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reservations.filter((reservation) => {
      const matchesStatus =
        statusFilter === "all" ? true : reservation.status === statusFilter;

      if (!matchesStatus) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        reservation.full_name,
        reservation.phone,
        reservation.email || "",
        reservation.car,
        reservation.pickup_location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [reservations, searchTerm, statusFilter]);

  const handleUnlock = (event: React.FormEvent) => {
    event.preventDefault();

    const cleanedToken = inputToken.trim();

    if (!cleanedToken) {
      setError("Entrez la cle d'administration.");
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, cleanedToken);
    setAdminToken(cleanedToken);
    setError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminToken("");
    setInputToken("");
    setReservations([]);
    setError("");
    setSearchTerm("");
    setStatusFilter("all");
    setRetryCount(0);
  };

  const handleRetryLoad = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleStatusChange = async (id: string, status: ReservationStatus) => {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(statusEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success || !data?.reservation) {
        throw new Error(data?.error || "Impossible de mettre a jour le statut.");
      }

      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? { ...reservation, status: data.reservation.status } : reservation
        )
      );
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Erreur inconnue lors de la mise a jour."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Supprimer cette reservation ? Cette action est definitive."
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(deleteEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || "Impossible de supprimer la reservation.");
      }

      setReservations((current) => current.filter((reservation) => reservation.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Erreur inconnue lors de la suppression."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportCsv = () => {
    const header = [
      "id",
      "full_name",
      "phone",
      "email",
      "car",
      "pickup_location",
      "pickup_date",
      "return_date",
      "message",
      "status",
      "source",
      "created_at",
    ];

    const rows = filteredReservations.map((reservation) => [
      reservation.id,
      reservation.full_name,
      reservation.phone,
      reservation.email || "",
      reservation.car,
      reservation.pickup_location,
      reservation.pickup_date,
      reservation.return_date,
      reservation.message || "",
      reservation.status,
      reservation.source,
      reservation.created_at,
    ]);

    const csvContent = [header, ...rows]
      .map((row) => row.map((value) => escapeCsvValue(String(value))).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const dateStamp = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `ritcars-reservations-${dateStamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-28 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-ritcars-orange">
                Admin
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-ritcars-black md:text-4xl">
                Reservations
              </h1>
              <p className="mt-3 max-w-2xl text-gray-600">
                Consultez les demandes enregistrees, recherchez un client et mettez
                a jour le statut de chaque reservation.
              </p>
            </div>

            {adminToken && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-white"
              >
                Se deconnecter
              </button>
            )}
          </div>

          {!adminToken ? (
            <div className="max-w-xl rounded-2xl bg-white p-6 shadow-lg md:p-8">
              <h2 className="font-display text-2xl font-bold text-ritcars-black">
                Acces admin
              </h2>
              <p className="mt-3 text-gray-600">
                Entrez la cle d'administration configuree dans Netlify pour afficher
                les reservations.
              </p>

              <form onSubmit={handleUnlock} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Cle d'administration
                  </label>
                  <input
                    type="password"
                    value={inputToken}
                    onChange={(event) => setInputToken(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                    placeholder="Entrez votre cle"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p className="font-semibold mb-1">Erreur:</p>
                    <p>{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="rounded-xl bg-ritcars-orange px-6 py-3 font-semibold text-white transition-colors hover:bg-ritcars-orange/90"
                >
                  Ouvrir le tableau de bord
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl bg-white shadow-lg">
              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="font-display text-2xl font-bold text-ritcars-black">
                  Liste des reservations
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {isLoading
                    ? "Chargement en cours..."
                    : `${filteredReservations.length} reservation(s) affichee(s)`}
                </p>
              </div>

              <div className="grid gap-4 border-b border-gray-100 px-6 py-5 md:grid-cols-[minmax(0,1fr)_220px]">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Rechercher
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                    placeholder="Nom, telephone, email, voiture..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Filtrer par statut
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(event.target.value as ReservationStatus | "all")
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 focus:border-ritcars-orange focus:outline-none focus:ring-1 focus:ring-ritcars-orange"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end border-b border-gray-100 px-6 py-4">
                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={filteredReservations.length === 0}
                  className="rounded-xl border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Export CSV
                </button>
              </div>

              {error && (
                <div className="m-6 rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
                  <p className="font-semibold mb-2">Erreur:</p>
                  <p className="mb-4">{error}</p>
                  <button
                    type="button"
                    onClick={handleRetryLoad}
                    disabled={isLoading}
                    className="inline-block rounded-lg bg-red-200 px-4 py-2 font-semibold text-red-800 transition-colors hover:bg-red-300 disabled:opacity-60"
                  >
                    {isLoading ? "Chargement..." : "Reessayer"}
                  </button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-xs uppercase tracking-[0.14em] text-gray-500">
                      <th className="px-6 py-4">Client</th>
                      <th className="px-6 py-4">Reservation</th>
                      <th className="px-6 py-4">Retrait</th>
                      <th className="px-6 py-4">Statut</th>
                      <th className="px-6 py-4">Creee le</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredReservations.map((reservation) => (
                      <tr key={reservation.id} className="align-top">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-ritcars-black">
                            {reservation.full_name}
                          </p>
                          <p className="mt-1 text-sm text-gray-600">{reservation.phone}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {reservation.email || "Email non renseigne"}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-700">
                          <p className="font-medium text-ritcars-black">{reservation.car}</p>
                          <p className="mt-1">
                            {reservation.pickup_date} to {reservation.return_date}
                          </p>
                          {reservation.message && (
                            <p className="mt-2 max-w-xs text-gray-500">{reservation.message}</p>
                          )}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-700">
                          {reservation.pickup_location}
                        </td>
                        <td className="px-6 py-5">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${statusClasses[reservation.status]}`}
                          >
                            {reservation.status}
                          </span>

                          <div className="mt-3 flex flex-wrap gap-2">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                type="button"
                                disabled={
                                  updatingId === reservation.id ||
                                  deletingId === reservation.id ||
                                  reservation.status === status
                                }
                                onClick={() => handleStatusChange(reservation.id, status)}
                                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] transition-colors ${
                                  reservation.status === status
                                    ? "bg-gray-900 text-white"
                                    : "border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                              >
                                {status}
                              </button>
                            ))}
                            <button
                              type="button"
                              disabled={updatingId === reservation.id || deletingId === reservation.id}
                              onClick={() => handleDelete(reservation.id)}
                              className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {deletingId === reservation.id ? "Deleting" : "Delete"}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-500">
                          {formatDate(reservation.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!isLoading && filteredReservations.length === 0 && !error && (
                  <div className="px-6 py-10 text-center text-gray-500">
                    Aucune reservation ne correspond aux filtres actuels.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
