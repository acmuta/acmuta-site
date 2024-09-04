import Image from 'next/image';

export default function People({ name, role, bio, imageUrl, socialLinks }) {
  return (
    <div className="flex items-center space-x-6 py-4">
      {/* Image on the left */}
      <div className="flex-shrink-0">
        <Image 
          src={imageUrl} 
          alt={`${name}'s picture`} 
          width={100} 
          height={100} 
          className="rounded-full"
        />
      </div>

      {/* Text and Social Links on the right */}
      <div>
        <h2 className="text-xl font-semibold">{name}</h2>
        <h4 className="text-sm text-gray-500 mb-2">{role}</h4>
        <div className="flex space-x-4">
          {socialLinks?.linkedin && (
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75c.967 0 1.75.784 1.75 1.75s-.783 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-1.337-.026-3.063-1.869-3.063-1.872 0-2.159 1.462-2.159 2.971v5.696h-3v-11h2.877v1.506h.041c.4-.757 1.376-1.554 2.832-1.554 3.027 0 3.586 1.993 3.586 4.583v6.465z"/>
              </svg>
            </a>
          )}
          {socialLinks?.twitter && (
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.723-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-2.723 0-4.932 2.21-4.932 4.932 0 .387.043.763.127 1.125-4.097-.205-7.73-2.169-10.156-5.154-.425.729-.666 1.577-.666 2.481 0 1.71.87 3.217 2.188 4.101-.807-.026-1.566-.247-2.229-.616v.062c0 2.385 1.697 4.374 3.95 4.828-.413.112-.849.171-1.296.171-.317 0-.626-.03-.928-.086.627 1.956 2.445 3.379 4.6 3.418-1.68 1.318-3.804 2.104-6.102 2.104-.396 0-.788-.023-1.175-.069 2.179 1.396 4.768 2.21 7.548 2.21 9.057 0 14.01-7.502 14.01-14.01 0-.213-.005-.425-.014-.636.962-.694 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
          )}
          {/* Add more social links as needed */}
        </div>
      </div>
    </div>
  );
}
