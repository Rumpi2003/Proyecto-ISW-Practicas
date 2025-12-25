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
      lang="es" // <--- 1. Obliga al navegador a usar el diccionario en español
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

          {/* INPUT */}
          {field.fieldType === 'input' && (
            <input
              {...register(field.name, {
                required: field.required ? `${field.label} es requerido` : false,
                minLength: field.minLength ? { value: field.minLength, message: `Mínimo ${field.minLength} caracteres` } : undefined,
              })}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              spellCheck="true" // <--- 2. Asegúrate de que esté en minúsculas y como string
              autoComplete="on" // Ayuda al navegador a entender que es un campo de texto común
              className={getFieldClass(field.name)}
            />
          )}

          {/* TEXTAREA */}
          {field.fieldType === 'textarea' && (
            <textarea
              {...register(field.name, {
                required: field.required ? `${field.label} es requerido` : false,
                minLength: field.minLength ? { value: field.minLength, message: `Mínimo ${field.minLength} caracteres` } : undefined,
              })}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              onChange={handleChange}
              spellCheck="true" // <--- 3. Activa el subrayado ondulado
              className={`${getFieldClass(field.name)} resize-none`}
            />
          )}

          {/* ... resto del código del select y errores ... */}
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