"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Building2, Mail, Calendar } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';


const PersonnelPage = () => {
  const [user, setUser] = useState(null);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedContractType, setSelectedContractType] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEvaluationTypeModal, setShowEvaluationTypeModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(null);


  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const router = useRouter();


  const decodeToken = (token) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    try {
      return JSON.parse(atob(payload));
    } catch (err) {
      console.error("Erreur de décodage du token", err);
      return null;
    }
  };

  useEffect(() => {
    if (!token) return;
    const decoded = decodeToken(token);
    setUser(decoded);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    const fetchDepartments = async () => {
      try {
        const res = await fetch('https://backendeva.onrender.com/departement', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDepartments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors de la récupération des départements", error);
      }
    };
    fetchDepartments();
  }, [token]);

  useEffect(() => {
    if (!token || !user || departments.length === 0) return;
    const fetchEmployees = async () => {
      let url = '';
      if (user.role === "Manager") {
        url = 'https://backendeva.onrender.com/staff/manager';
      } else if (user.role === "RH") {
        url = 'https://backendeva.onrender.com/staff/All';
      } else {
        return;
      }

      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Erreur API: ${res.status} - ${errorText}`);
        }

        const data = await res.json();

        const enriched = data.map(emp => ({
          ...emp,
          departement: user.role === 'Manager'
            ? emp.departement || emp.departement || {}
            : departments.find(d => d._id === emp.departement) || {},
          typeContrat: emp.typeContrat || 'Non spécifié',
        }));

        setStaff(enriched);
        setLoading(false);
      } catch (err) {
        console.error("Erreur fetch employés", err);
        setLoading(false);
      }
    };
    fetchEmployees();
  }, [token, user, departments]);

  useEffect(() => {
    if (selectedEmployee) {
      setValue("nom", selectedEmployee.nom);
      setValue("prenom", selectedEmployee.prenom);
      setValue("email", selectedEmployee.email);
      setValue("poste", selectedEmployee.poste);
      setValue("typeContrat", selectedEmployee.typeContrat);
      setValue("departement", selectedEmployee.departement?._id || selectedEmployee.departement);
      setValue("dateEmbauche", selectedEmployee.dateEmbauche?.split('T')[0]);
      setValue("dateFinContrat", selectedEmployee.dateFinContrat?.split('T')[0] || '');
    }
  }, [selectedEmployee, setValue]);

  const handleAddModalOpen = () => {
    reset();
    setShowAddModal(true);
  };

  const onSubmitUpdate = async (data) => {
    try {
      const res = await fetch(`https://backendeva.onrender.com/staff/${selectedEmployee._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Échec de la mise à jour");

      await fetchEmployees();
      setShowEditModal(false);
      alert("Employé mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour");
    }
  };

  const deleteEmployee = async (id) => {
    const confirmed = confirm("Supprimer cet employé ?");
    if (!confirmed || !token) return;
    try {
      const res = await fetch(`https://backendeva.onrender.com/staff/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStaff(prev => prev.filter(emp => emp._id !== id));
        alert("Employé supprimé avec succès !");
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur suppression employé :", error);
    }
  };

  const onSubmit = async (data) => {
    const typeContrat = watch("typeContrat");

    // Validation manuelle côté client
    if (typeContrat === "CDI") {
      if (!data.dateEmbauche) {
        alert("Date d'embauche requise pour un CDI.");
        return;
      }
    }

    if (typeContrat === "CDD") {
      if (!data.dateEmbauche) {
        alert("Date d'embauche requise pour un CDD.");
        return;
      }
      if (!data.dateFinContrat) {
        alert("Date de fin de contrat requise pour un CDD.");
        return;
      }
    }

    if (typeContrat === "Stagiaire") {
      if (!data.dateDebutStage) {
        alert("Date de début de stage requise.");
        return;
      }
      if (!data.dateFinStage) {
        alert("Date de fin de stage requise.");
        return;
      }
    }

    // Construction du payload à envoyer
    const payload = {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      poste: data.poste,
      departement: data.departement,
      typeContrat: data.typeContrat,
      dateEmbauche:
        typeContrat === "CDI" || typeContrat === "CDD" ? data.dateEmbauche : null,
      dateFinContrat:
        typeContrat === "CDD" ? data.dateFinContrat : null,
      dateDebutStage: typeContrat === "Stagiaire" ? data.dateDebutStage : null,
      dateFinStage: typeContrat === "Stagiaire" ? data.dateFinStage : null,
    };

    try {
      const res = await fetch("https://backendeva.onrender.com/staff", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erreur lors de l'enregistrement");
      }

      const result = await res.json();
      setStaff((prev) => [...prev, result.staff]); // result.staff car le backend retourne { message, staff }
      alert("Employé ajouté avec succès !");
      reset();
      setShowAddModal(false);
    } catch (err) {
      console.error("Erreur lors de la soumission :", err);
      alert(`Une erreur est survenue : ${err.message}`);
    }
  };



  /*const handleViewEvaluations = async (staffId) => {
    try {
      const res = await fetch(`http://localhost:7000/Evaluation/staff/${staffId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la récupération des évaluations");
      }

      const data = await res.json();
      console.log("Évaluations récupérées :", data);

      // Redirection vers une page dédiée avec l'identifiant du staff
      router.push(`/with-sidebar/evaluations/${id}`);
    } catch (err) {
      console.error("❌", err);
      alert("Erreur lors de la récupération des évaluations.");
    }
  }; */
  const handleViewEvaluations = async (id) => {
    try {
      const dateEvaluation = dayjs().format('YYYY-MM-DD');
      router.push(`/with-sidebar/evaluations/${id}?date=${dateEvaluation}`);
    } catch (err) {
      console.error("❌", err);
      alert("Erreur lors de la redirection vers la page d’évaluations.");
    }
  };

  /*const handleNewEvaluationClick = (staffId) => {
    if (!staffId) {
      console.error("Aucun staffId fourni pour créer une nouvelle évaluation.");
      alert("Impossible de créer l’évaluation : agent non identifié.");
      return;
    }

    try {
      router.push(`/with-sidebar/evaluations/new/${staffId}`);
    } catch (error) {
      console.error("Erreur de redirection :", error);
      alert("Une erreur est survenue lors de la redirection.");
    }
  }; */

  const handleNewEvaluationClick = (id) => {
    if (!id) {
      console.error("Aucun staffId fourni pour créer une nouvelle évaluation.");
      alert("Impossible de créer l’évaluation : agent non identifié.");
      return;
    }

    try {
      const dateEvaluation = dayjs().format('YYYY-MM-DD');
      router.push(`/with-sidebar/evaluations/new/${id}?date=${dateEvaluation}`);
    } catch (error) {
      console.error("Erreur de redirection :", error);
      alert("Une erreur est survenue lors de la redirection.");
    }
  };



  const filteredStaff = staff.filter(emp => {
    const matchesSearch =
      emp.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.poste?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = user?.role === 'RH'
      ? (!selectedDepartment || emp.department?._id === selectedDepartment)
      : true;

    const matchesContractType = !selectedContractType || emp.typeContrat === selectedContractType;

    const hasAccess = user?.role === 'RH' ||
      (user?.role === 'Manager' && emp.department?._id === user?.departementId);

    return matchesSearch && matchesDepartment && matchesContractType && hasAccess;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <span>{user?.role === 'RH' ? 'Gestion du Personnel' : 'Mon Équipe'}</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {user?.role === 'RH' ? 'Gérez tous les employés de Fontaine finance' : 'Consultez les membres de votre équipe'}
            </p>
          </div>
          {user?.role === 'RH' && (
            <button
              onClick={handleAddModalOpen}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>Ajouter un employé</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {user && user.role !== 'Manager' && (
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label='Sélectionner un département'
            >
              <option value="">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          )}


          <select
            value={selectedContractType}
            onChange={(e) => setSelectedContractType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            aria-label='Sélectionner un type de contrat'
          >
            <option value="">Tous les contrats</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="STAGE">Stage</option>
          </select>

          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              {filteredStaff.length} employé(s)
            </span>
          </div>
        </div>
      </div>

      {/* Modal pour ajouter un employé */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              aria-label="Fermer"
            >✕</button>

            <h2 className="text-xl font-bold mb-4 text-blue-600">Ajouter un employé</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom *"
                  {...register("nom", { required: "Nom est requis" })}
                  className={`border px-4 py-2 rounded-lg w-full ${errors.nom ? 'border-red-500' : ''}`}
                />
                {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}

                <input
                  type="text"
                  placeholder="Prénom"
                  {...register("prenom")}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              </div>

              <input
                type="email"
                placeholder="Email *"
                {...register("email", { required: "Email est requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <input
                type="text"
                placeholder="Poste *"
                {...register("poste", { required: "Poste est requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.poste ? 'border-red-500' : ''}`}
              />
              {errors.poste && <p className="text-red-500 text-sm">{errors.poste.message}</p>}

              <select
                aria-label="Sélectionner un département"
                {...register("departement", { required: "Département est requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.departement ? 'border-red-500' : ''}`}
              >
                <option value="">-- Sélectionner un département *</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.name}</option>
                ))}
              </select>
              {errors.departement && <p className="text-red-500 text-sm">{errors.departement.message}</p>}

              <select
                aria-label="Type de contrat"
                {...register("typeContrat", { required: "Type de contrat est requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.typeContrat ? 'border-red-500' : ''}`}
              >
                <option value="">-- Type de contrat *</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stagiaire">Stage</option>
              </select>
              {errors.typeContrat && <p className="text-red-500 text-sm">{errors.typeContrat.message}</p>}

              {/* Champs dynamiques en fonction du contrat */}
              {watch("typeContrat") === "CDD" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm text-gray-600">
                    Date d&apos;embauche *
                    <input
                      type="date"
                      {...register("dateEmbauche", { required: "Date d'embauche requise pour un CDD" })}
                      className={`border px-4 py-2 rounded-lg w-full mt-1 ${errors.dateEmbauche ? 'border-red-500' : ''}`}
                    />
                  </label>

                  <label className="text-sm text-gray-600">
                    Date fin de contrat *
                    <input
                      type="date"
                      {...register("dateFinContrat", { required: "Date de fin de contrat requise pour un CDD" })}
                      className={`border px-4 py-2 rounded-lg w-full mt-1 ${errors.dateFinContrat ? 'border-red-500' : ''}`}
                    />
                  </label>
                </div>
              )}

              {watch("typeContrat") === "Stagiaire" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm text-gray-600">
                    Début de stage *
                    <input
                      type="date"
                      {...register("dateDebutStage", { required: "Date de début de stage requise" })}
                      className={`border px-4 py-2 rounded-lg w-full mt-1 ${errors.dateDebutStage ? 'border-red-500' : ''}`}
                    />
                  </label>

                  <label className="text-sm text-gray-600">
                    Fin de stage *
                    <input
                      type="date"
                      {...register("dateFinStage", { required: "Date de fin de stage requise" })}
                      className={`border px-4 py-2 rounded-lg w-full mt-1 ${errors.dateFinStage ? 'border-red-500' : ''}`}
                    />
                  </label>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal pour modifier un employé */}
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-xl relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
              aria-label="Fermer"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-blue-600">Modifier l&apos;employé</h2>

            <form onSubmit={handleSubmit(onSubmitUpdate)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Nom *"
                  {...register("nom", { required: "Nom requis" })}
                  className={`border px-4 py-2 rounded-lg w-full ${errors.nom ? 'border-red-500' : ''}`}
                />
                <input
                  type="text"
                  placeholder="Prénom"
                  {...register("prenom")}
                  className="border px-4 py-2 rounded-lg w-full"
                />
              </div>

              <input
                type="email"
                placeholder="Email *"
                {...register("email", { required: "Email requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.email ? 'border-red-500' : ''}`}
              />

              <input
                type="text"
                placeholder="Poste *"
                {...register("poste", { required: "Poste requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.poste ? 'border-red-500' : ''}`}
              />

              <select
                {...register("typeContrat", { required: "Type de contrat requis" })}
                className={`border px-4 py-2 rounded-lg w-full ${errors.typeContrat ? 'border-red-500' : ''}`}
              >
                <option value="">-- Type de contrat *</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stagiaire">Stage</option>
              </select>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-gray-600">
                  Date d&apos;embauche *
                  <input
                    type="date"
                    {...register("dateEmbauche", { required: "Date d'embauche requise" })}
                    className={`border px-4 py-2 rounded-lg w-full mt-1 ${errors.dateEmbauche ? 'border-red-500' : ''}`}
                  />
                </label>

                <label className="text-sm text-gray-600">
                  Date fin de contrat
                  <input
                    type="date"
                    {...register("dateFinContrat")}
                    className="border px-4 py-2 rounded-lg w-full mt-1"
                  />
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((employee) => (
          <div key={employee._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div className="p-6">
              {/* Employee Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-lg font-medium text-white">
                      {employee.nom[0]}{employee.prenom[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employee.nom} {employee.prenom}</h3>
                    <p className="text-sm text-gray-600">{employee.poste}</p>
                  </div>
                </div>

                {/* Boutons modifier/supprimer visibles uniquement pour RH */}
                <div className="flex space-x-1">
                  {user?.role === 'RH' && (
                    <>
                      <button
                        onClick={() => { setSelectedEmployee(employee); setShowEditModal(true); }}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                        aria-label="Modifier les informations de l'employé"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteEmployee(employee._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        aria-label="Supprimer l'employé"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Détails de l'employé */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{employee.email}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Building2 className="h-4 w-4" />
                  <span>{employee.departement?.name || 'Non spécifié'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{employee.typeContrat}</span>
                  </div>
                  {employee.dateFinContrat && (() => {
                    const today = new Date();
                    const endDate = new Date(employee.dateFinContrat);
                    const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

                    if (diffInDays <= 14) {
                      return (
                        <span className="text-sm font-medium text-red-600">
                          Expire le {endDate.toLocaleDateString('fr-FR')}
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewEvaluations(employee._id)}
                      className="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Voir évaluations
                    </button>
                    {employee.managerId === user?.id && (
                      <button
                        className="flex-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        onClick={() => {
                          setSelectedStaffId(employee._id);
                          setShowEvaluationTypeModal(true);
                        }}
                      >
                        Nouvelle évaluation
                      </button>
                    )}

                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>


      {!loading && filteredStaff.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun employé trouvé</h3>
          <p className="text-gray-600">Aucun employé ne correspond à vos critères de recherche.</p>
        </div>
      )}
      {showEvaluationTypeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm relative">
            <button
              onClick={() => setShowEvaluationTypeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4 text-gray-800">Choisir le type d’évaluation</h2>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const dateEvaluation = dayjs().format('YYYY-MM-DD');
                  setShowEvaluationTypeModal(false);
                  router.push(`/with-sidebar/evaluations/new/${selectedStaffId}?type=standard&date=${dateEvaluation}`);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Évaluation mi-parcours
              </button>
              <button
                onClick={() => {
                  const dateEvaluation = dayjs().format('YYYY-MM-DD');
                  setShowEvaluationTypeModal(false);
                  router.push(`/with-sidebar/evaluationPotentiel?staffId=${selectedStaffId}&date=${dateEvaluation}`);
                }}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Évaluation de potentiel
              </button>

            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default PersonnelPage;
