import React from 'react';
import { Link } from 'react-router-dom';

const ContactInfoCards = () => {
  const infoBlocks = [
    {
      title: '¡Queremos saber lo que piensas!',
      content: (
        <>
          Si encuentras alguna inconsistencia, error o tienes alguna duda respecto a la informacion disponible en nuestra pagina web, por favor comunicate a{' '}
          <a href="mailto:hola@criaderopasoreal.com" className="font-semibold text-[#7b5d22] hover:text-[#936f2d]">
            hola@criaderopasoreal.com
          </a>
          .
        </>
      ),
    },
    {
      title: '¿Tienes alguna pregunta?',
      content: (
        <>
          Visita nuestra seccion de{' '}
          <Link to="/faq" className="font-semibold text-[#7b5d22] hover:text-[#936f2d]">
            preguntas frecuentes
          </Link>
          , en donde encontraras informacion relevante a nuestra oferta comercial y sobre la operatividad de nuestro criadero.
        </>
      ),
    },
    {
      title: '¿Quieres compartir tu historia criando Asnales o Mulares?',
      content: (
        <>
          Si eres amante y apasionado por la cria y cuidado de estas dos especies y deseas promulgar tu historia, nos encantaria publicarla en nuestra web y redes sociales. Comunicate con nosotros a traves del siguiente email{' '}
          <a href="mailto:hola@criaderopasoreal.com" className="font-semibold text-[#7b5d22] hover:text-[#936f2d]">
            hola@criaderopasoreal.com
          </a>
          .
        </>
      ),
    },
    {
      title: '¿Estás en la búsqueda de una comunidad de Cria de Asnales?',
      content: (
        <>
          Visita nuestra pagina en Facebook,{' '}
          <a href="https://facebook.com/criaderopasoreal" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#7b5d22] hover:text-[#936f2d]">
            criaderopasoreal
          </a>
          , alli encontraras actualizaciones sobre el dia a dia en el criadero. Tambien podras interactuar con otros criadores de asnales de Colombia y el mundo y compartir experiencias.
        </>
      ),
    },
    {
      title: '¿Quieres conocer más sobre nuestro Criadero?',
      content: (
        <>
          Siempre estamos abiertos a nuevas ideas y comentarios. Si quieres profundizar mas sobre nuestra forma de crianza y lo que hacemos puedes agendar una visita y conocer nuestra finca y los animales en ella. Cualquier comentario sera bien recibido en{' '}
          <a href="mailto:hola@criaderopasoreal.com" className="font-semibold text-[#7b5d22] hover:text-[#936f2d]">
            hola@criaderopasoreal.com
          </a>
          .
        </>
      ),
    },
  ];

  return (
    <div className="bg-white border border-[#e7dfc7] divide-y divide-[#e7dfc7]">
      {infoBlocks.map((block) => (
        <article key={block.title} className="px-5 py-5 md:px-7 md:py-6">
          <h3 className="font-playfair text-xl md:text-2xl font-bold text-[#18140e] mb-2">
            {block.title}
          </h3>
          <p className="text-[#514638] leading-relaxed text-sm md:text-base">
            {block.content}
          </p>
        </article>
      ))}
    </div>
  );
};

export default ContactInfoCards;
