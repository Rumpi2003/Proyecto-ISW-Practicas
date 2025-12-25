import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const Form = ({ title, fields, buttonText, onSubmit, footerContent }) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  return (
    <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-2xl border border-gray-100">
      {title && (
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="group">
            {field.label && (
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1 group-focus-within:text-purple-600 transition-colors">
                {field.label}
              </label>
            )}

            {/* --- INPUT TYPE TEXT, DATE, PASSWORD, ETC --- */}
            {field.fieldType === 'input' && (
              <input
                {...register(field.name, {
                  required: field.required ? "Este campo es obligatorio" : false,
                  minLength: field.minLength ? { value: field.minLength, message: `Mínimo ${field.minLength} caracteres` } : undefined,
                  // 👇 ESTA ES LA LÍNEA MÁGICA QUE FALTABA:
                  validate: field.validate 
                })}
                type={field.type}
                placeholder={field.placeholder}
                min={field.min} // Para bloquear fechas pasadas en el calendario
                className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 transition-all outline-none bg-gray-50
                  ${errors[field.name] 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                    : "border-gray-100 focus:border-purple-500 focus:ring-purple-100 group-hover:border-gray-200"
                  }`}
              />
            )}

            {/* --- TEXTAREA --- */}
            {field.fieldType === 'textarea' && (
              <textarea
                {...register(field.name, {
                  required: field.required ? "Este campo es obligatorio" : false,
                  minLength: field.minLength ? { value: field.minLength, message: `Mínimo ${field.minLength} caracteres` } : undefined,
                  validate: field.validate 
                })}
                rows={field.rows || 4}
                placeholder={field.placeholder}
                className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 transition-all outline-none bg-gray-50 resize-none
                  ${errors[field.name] 
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                    : "border-gray-100 focus:border-purple-500 focus:ring-purple-100 group-hover:border-gray-200"
                  }`}
              />
            )}

            {/* --- SELECT --- */}
            {field.fieldType === 'select' && (
              <div className="relative">
                <select
                  {...register(field.name, {
                    required: field.required ? "Selecciona una opción" : false,
                    validate: field.validate
                  })}
                  className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 transition-all outline-none bg-gray-50 appearance-none cursor-pointer
                    ${errors[field.name] 
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100" 
                      : "border-gray-100 focus:border-purple-500 focus:ring-purple-100 group-hover:border-gray-200"
                    }`}
                >
                  <option value="">Seleccione...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Flecha personalizada para el select */}
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                </div>
              </div>
            )}

            {/* --- CHECKBOX GROUP (Para Carreras) --- */}
            {field.fieldType === 'checkbox-group' && (
              <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {field.options?.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        value={opt.value}
                        {...register(field.name, {
                          required: field.required ? "Debes seleccionar al menos una opción" : false,
                          validate: field.validate
                        })}
                        className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                      />
                      <span className="text-gray-700">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* --- MENSAJE DE ERROR --- */}
            {errors[field.name] && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1 font-medium animate-pulse">
                <span>⚠</span>
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-lg"
        >
          {buttonText || 'Enviar'}
        </button>
      </form>

      {footerContent && (
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          {footerContent}
        </div>
      )}
    </div>
  );
};

export default Form;