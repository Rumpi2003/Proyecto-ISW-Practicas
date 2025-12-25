// frontend/src/components/Form.jsx
import { useForm } from 'react-hook-form';

const Form = ({ title, fields, buttonText, onSubmit, onChange }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: "onChange"
  });

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const getFieldClass = (fieldName) => {
    const baseClass = "w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-300 focus:ring-2";
    const errorClass = errors[fieldName] 
      ? "border-red-500 focus:ring-red-200 focus:border-red-500" 
      : "border-gray-200 focus:border-purple-500 focus:ring-purple-200";
    return `${baseClass} ${errorClass}`;
  };

  return (
    <form 
      lang="es"
      className="space-y-6 bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full" 
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <h1 className="text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-8">
        {title}
      </h1>
      
      {fields.map((field, index) => (
        <div key={index} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-semibold text-gray-700">
            {field.label}
          </label>

          {/* 1. INPUT DE TEXTO */}
          {field.fieldType === 'input' && (
            <input
              {...register(field.name, {
                required: field.required ? `${field.label} es requerido` : false,
                minLength: field.minLength ? { value: field.minLength, message: `Mínimo ${field.minLength} caracteres` } : undefined,
              })}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              spellCheck="true"
              autoComplete="on"
              className={getFieldClass(field.name)}
            />
          )}

          {/* 2. TEXTAREA */}
          {field.fieldType === 'textarea' && (
            <textarea
              {...register(field.name, {
                required: field.required ? `${field.label} es requerido` : false,
                minLength: field.minLength ? { value: field.minLength, message: `Mínimo ${field.minLength} caracteres` } : undefined,
              })}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              onChange={handleChange}
              spellCheck="true"
              className={`${getFieldClass(field.name)} resize-none`}
            />
          )}

          {/* 3. SELECT (Único) */}
          {field.fieldType === 'select' && (
            <select
              {...register(field.name, {
                required: field.required ? `${field.label} es requerido` : false,
              })}
              onChange={handleChange}
              className={`${getFieldClass(field.name)} bg-white`}
            >
              <option value="">Seleccione una opción</option>
              {field.options && field.options.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {/* 4. CHECKBOX GROUP (Múltiple) - NUEVO CÓDIGO */}
          {field.fieldType === 'checkbox-group' && (
            <div className={`p-4 border-2 rounded-lg transition-colors ${errors[field.name] ? "border-red-500 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
              <p className="text-gray-600 font-bold mb-3 text-sm border-b pb-2 border-gray-200">
                Selecciona una o más opciones:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {field.options && field.options.map((opt, i) => (
                  <label key={i} className="flex items-center space-x-3 p-3 bg-white rounded shadow-sm hover:bg-purple-50 cursor-pointer transition-all border border-gray-100 hover:border-purple-200">
                    <input
                      type="checkbox"
                      value={opt.value}
                      {...register(field.name, {
                        required: field.required ? `Debes seleccionar al menos una opción` : false
                      })}
                      className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500 border-gray-300"
                    />
                    <span className="text-gray-700 text-sm font-medium">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* MENSAJES DE ERROR */}
          {errors[field.name] && (
            <p className="text-red-500 text-xs font-bold mt-1 animate-pulse">
              ⚠️ {errors[field.name].message}
            </p>
          )}
        </div>
      ))}

      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default Form;