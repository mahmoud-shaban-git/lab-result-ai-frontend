import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { LabResultRequest } from '../types';
import { LAB_PARAMETERS } from '../constants/labData';

interface LabFormProps {
    onSubmit: (data: LabResultRequest) => void;
    isLoading: boolean;
}

const LabForm = ({ onSubmit, isLoading }: LabFormProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<LabResultRequest>({
        parameter: LAB_PARAMETERS[0].label,
        value: 0,
        unit: LAB_PARAMETERS[0].unit,
        age: 0,
        gender: 'male',
    });

    // Automatically update unit when parameter changes
    useEffect(() => {
        const selectedParam = LAB_PARAMETERS.find(p => p.label === formData.parameter);
        if (selectedParam) {
            setFormData(prev => ({ ...prev, unit: selectedParam.unit }));
        }
    }, [formData.parameter]);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'value' || name === 'age' ? Number(value) : value,
        }));
    };

    const isFormValid = formData.value > 0 && formData.age > 0 && formData.parameter.length > 0;

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isFormValid) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-100/50 relative overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 bg-white/50 z-10 cursor-not-allowed"></div>
            )}

            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg rtl:ml-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 rtl:flip" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                    {t('form.title')}
                </h2>
            </div>

            <div className="space-y-6">
                {/* Parameter Selection */}
                <div>
                    <label htmlFor="parameter" className="block text-sm font-semibold text-slate-700 mb-2">
                        {t('form.parameter')}
                    </label>
                    <div className="relative">
                        <select
                            id="parameter"
                            name="parameter"
                            value={formData.parameter}
                            onChange={handleChange}
                            className="w-full ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 py-3 appearance-none rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 font-medium"
                        >
                            {LAB_PARAMETERS.map(param => (
                                <option key={param.label} value={param.label}>{param.label}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center px-4 pointer-events-none text-slate-500">
                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                    </div>
                </div>

                {/* Value and Unit */}
                <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-8">
                        <label htmlFor="value" className="block text-sm font-semibold text-slate-700 mb-2">
                            {t('form.value')}
                        </label>
                        <input
                            type="number"
                            id="value"
                            name="value"
                            step="any"
                            placeholder={t('form.placeholderValue')}
                            value={formData.value || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 font-mono text-lg"
                        />
                    </div>
                    <div className="col-span-4">
                        <label htmlFor="unit" className="block text-sm font-semibold text-slate-700 mb-2">
                            {t('form.unit')}
                        </label>
                        <input
                            type="text"
                            id="unit"
                            name="unit"
                            readOnly
                            value={formData.unit}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-default focus:outline-none"
                        />
                    </div>
                </div>

                {/* Age and Gender */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-2">
                            {t('form.age')}
                        </label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            min="0"
                            max="120"
                            placeholder={t('form.placeholderAge')}
                            value={formData.age || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800"
                        />
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-2">
                            {t('form.gender')}
                        </label>
                        <div className="relative">
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full ltr:pl-4 ltr:pr-10 rtl:pr-4 rtl:pl-10 py-3 appearance-none rounded-xl border border-slate-200 bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800"
                            >
                                <option value="male">{t('form.male')}</option>
                                <option value="female">{t('form.female')}</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 rtl:left-0 rtl:right-auto flex items-center px-4 pointer-events-none text-slate-500">
                                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    className={`w-full py-4 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2
            ${!isFormValid || isLoading
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]'}
          `}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>{t('form.analyzing')}</span>
                        </>
                    ) : (
                        <>
                            <span>{t('form.submit')}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default LabForm;
