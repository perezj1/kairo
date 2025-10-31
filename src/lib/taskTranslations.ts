// Traducciones de tareas por ID
export interface TaskTranslation {
  title: string;
  description: string;
}

export const TASK_TRANSLATIONS: Record<string, Record<string, TaskTranslation>> = {
  // Bajar peso
  "c911ced7-5abb-4d31-8ee8-7c5738875989": {
    es: { title: "Camina 15 minutos", description: "Da un paseo corto después de comer para activar tu metabolismo" },
    en: { title: "Walk 15 minutes", description: "Take a short walk after eating to activate your metabolism" },
    de: { title: "15 Minuten gehen", description: "Machen Sie nach dem Essen einen kurzen Spaziergang, um Ihren Stoffwechsel zu aktivieren" }
  },
  "3fb61f5a-db02-4611-8e58-31134075abc9": {
    es: { title: "Bebe agua antes de comer", description: "Toma un vaso de agua 20 minutos antes de cada comida" },
    en: { title: "Drink water before eating", description: "Drink a glass of water 20 minutes before each meal" },
    de: { title: "Trinken Sie Wasser vor dem Essen", description: "Trinken Sie 20 Minuten vor jeder Mahlzeit ein Glas Wasser" }
  },
  "94318711-1403-49e1-9565-8afbb9db6e0d": {
    es: { title: "Usa escaleras", description: "Sube escaleras en lugar del ascensor hoy" },
    en: { title: "Use stairs", description: "Take the stairs instead of the elevator today" },
    de: { title: "Benutze die Treppe", description: "Nehmen Sie heute die Treppe statt den Aufzug" }
  },
  "a49985bd-8213-4cf5-8585-75bc5a0e7afa": {
    es: { title: "Porciones más pequeñas", description: "Usa un plato más pequeño en tu próxima comida" },
    en: { title: "Smaller portions", description: "Use a smaller plate for your next meal" },
    de: { title: "Kleinere Portionen", description: "Verwenden Sie einen kleineren Teller für Ihre nächste Mahlzeit" }
  },
  "e515b06d-5262-4bbe-97f9-dae1f2e39fc3": {
    es: { title: "Mastica despacio", description: "Tómate al menos 20 minutos para comer tu próxima comida" },
    en: { title: "Chew slowly", description: "Take at least 20 minutes to eat your next meal" },
    de: { title: "Langsam kauen", description: "Nehmen Sie sich mindestens 20 Minuten Zeit für Ihre nächste Mahlzeit" }
  },

  // Ahorrar
  "89b20ce0-1e30-4d99-b3c0-26010408941f": {
    es: { title: "Regla 24 horas", description: "Espera 24 horas antes de hacer una compra impulsiva" },
    en: { title: "24-hour rule", description: "Wait 24 hours before making an impulse purchase" },
    de: { title: "24-Stunden-Regel", description: "Warten Sie 24 Stunden, bevor Sie einen Impulskauf tätigen" }
  },
  "a29aa29b-132e-4566-b9cb-67e36ff23436": {
    es: { title: "Café en casa", description: "Prepara tu café en casa en lugar de comprarlo" },
    en: { title: "Coffee at home", description: "Make your coffee at home instead of buying it" },
    de: { title: "Kaffee zu Hause", description: "Machen Sie Ihren Kaffee zu Hause, anstatt ihn zu kaufen" }
  },
  "d03ff73b-e599-409d-918f-573360eea66f": {
    es: { title: "Lista de compras", description: "Haz una lista antes de ir al supermercado y síguela" },
    en: { title: "Shopping list", description: "Make a list before going to the supermarket and follow it" },
    de: { title: "Einkaufsliste", description: "Erstellen Sie eine Liste, bevor Sie zum Supermarkt gehen, und befolgen Sie sie" }
  },
  "1a784256-3711-40e9-be83-a398b2929a1f": {
    es: { title: "Revisa suscripciones", description: "Revisa tus suscripciones y cancela las que no uses" },
    en: { title: "Review subscriptions", description: "Review your subscriptions and cancel the ones you don't use" },
    de: { title: "Abonnements überprüfen", description: "Überprüfen Sie Ihre Abonnements und kündigen Sie die, die Sie nicht nutzen" }
  },
  "7e7b869c-d311-485d-b4f1-cdaf1f5bf807": {
    es: { title: "Comida casera", description: "Cocina en casa en lugar de pedir comida" },
    en: { title: "Home-cooked meal", description: "Cook at home instead of ordering food" },
    de: { title: "Hausgemachtes Essen", description: "Kochen Sie zu Hause, anstatt Essen zu bestellen" }
  },

  // Mantenerse en forma
  "6eeae41b-8b89-4d4d-bb33-e2c8245e2108": {
    es: { title: "10 flexiones", description: "Haz 10 flexiones ahora mismo" },
    en: { title: "10 push-ups", description: "Do 10 push-ups right now" },
    de: { title: "10 Liegestütze", description: "Machen Sie jetzt 10 Liegestütze" }
  },
  "2eecd1b6-d1f0-4207-8db7-47598b08508c": {
    es: { title: "Estira 5 minutos", description: "Toma 5 minutos para estirar todo tu cuerpo" },
    en: { title: "Stretch 5 minutes", description: "Take 5 minutes to stretch your whole body" },
    de: { title: "5 Minuten dehnen", description: "Nehmen Sie sich 5 Minuten Zeit, um Ihren ganzen Körper zu dehnen" }
  },
  "09ec9bfc-0d8c-4eed-b14e-e76e9ff90e24": {
    es: { title: "20 sentadillas", description: "Realiza 20 sentadillas con buena forma" },
    en: { title: "20 squats", description: "Perform 20 squats with good form" },
    de: { title: "20 Kniebeugen", description: "Führen Sie 20 Kniebeugen mit guter Form aus" }
  },
  "d7f57a6b-68f2-47d1-ad7a-6e48f38f1b1a": {
    es: { title: "Plank 30 segundos", description: "Mantén la posición de plancha durante 30 segundos" },
    en: { title: "Plank 30 seconds", description: "Hold a plank position for 30 seconds" },
    de: { title: "Plank 30 Sekunden", description: "Halten Sie eine Plank-Position für 30 Sekunden" }
  },
  "b29ef8c1-5426-4f47-b91e-2e9c0a8d7e3b": {
    es: { title: "Salta la cuerda", description: "Salta la cuerda durante 3 minutos" },
    en: { title: "Jump rope", description: "Jump rope for 3 minutes" },
    de: { title: "Seilspringen", description: "Springen Sie 3 Minuten Seil" }
  },

  // Dejar de fumar
  "a17a32a2-6eca-4fec-9b38-519fedd5b3de": {
    es: { title: "Respira profundo", description: "Cuando sientas el deseo, respira profundamente 10 veces" },
    en: { title: "Breathe deeply", description: "When you feel the urge, breathe deeply 10 times" },
    de: { title: "Tief atmen", description: "Wenn Sie das Verlangen spüren, atmen Sie 10 Mal tief ein" }
  },
  "c2dc75d6-e918-440d-bb18-ff31f04c7737": {
    es: { title: "Bebe agua", description: "Mantén una botella de agua cerca y bebe cuando tengas ganas" },
    en: { title: "Drink water", description: "Keep a water bottle nearby and drink when you feel the urge" },
    de: { title: "Wasser trinken", description: "Halten Sie eine Wasserflasche bereit und trinken Sie, wenn Sie das Verlangen spüren" }
  },
  "7d01f5cb-9f2e-4bc8-b093-237764296b3f": {
    es: { title: "Mastica chicle", description: "Ten chicle sin azúcar a mano para ocupar tu boca" },
    en: { title: "Chew gum", description: "Keep sugar-free gum handy to keep your mouth busy" },
    de: { title: "Kaugummi kauen", description: "Halten Sie zuckerfreien Kaugummi bereit, um Ihren Mund zu beschäftigen" }
  },
  "ebf7838f-6ee8-4eca-ae1a-feb0bf421126": {
    es: { title: "Llama a alguien", description: "Habla con un amigo durante 5 minutos cuando sientas el impulso" },
    en: { title: "Call someone", description: "Talk to a friend for 5 minutes when you feel the urge" },
    de: { title: "Rufen Sie jemanden an", description: "Sprechen Sie 5 Minuten mit einem Freund, wenn Sie das Verlangen spüren" }
  },
  "b540727c-4b25-45fb-aa16-21fe6e916a48": {
    es: { title: "Camina 5 minutos", description: "Sal a caminar cuando aparezca el deseo de fumar" },
    en: { title: "Walk 5 minutes", description: "Go for a walk when the urge to smoke appears" },
    de: { title: "5 Minuten gehen", description: "Gehen Sie spazieren, wenn das Verlangen zu rauchen auftritt" }
  },

  // Comer más sano
  "99d4cf91-942c-42ca-a493-568851436f40": {
    es: { title: "Añade una fruta", description: "Incluye una fruta en tu próxima comida o snack" },
    en: { title: "Add a fruit", description: "Include a fruit in your next meal or snack" },
    de: { title: "Fügen Sie Obst hinzu", description: "Fügen Sie eine Frucht zu Ihrer nächsten Mahlzeit oder Snack hinzu" }
  },
  "07cb09da-d1a7-48ea-8e3a-011944da0ab3": {
    es: { title: "Proteína en el desayuno", description: "Incluye proteína en tu desayuno de mañana" },
    en: { title: "Protein at breakfast", description: "Include protein in tomorrow's breakfast" },
    de: { title: "Protein zum Frühstück", description: "Fügen Sie Protein zu Ihrem morgigen Frühstück hinzu" }
  },
  "4fd33685-4585-4881-b8be-3ff3ac7c938b": {
    es: { title: "Evita procesados", description: "Elige alimentos sin procesar en tu próxima comida" },
    en: { title: "Avoid processed foods", description: "Choose unprocessed foods in your next meal" },
    de: { title: "Vermeiden Sie verarbeitete Lebensmittel", description: "Wählen Sie unverarbeitete Lebensmittel für Ihre nächste Mahlzeit" }
  },
  "dbf7a39c-9430-475a-9ad9-3aad03d90e4e": {
    es: { title: "Snack de vegetales", description: "Prepara palitos de zanahoria o apio como snack" },
    en: { title: "Vegetable snack", description: "Prepare carrot or celery sticks as a snack" },
    de: { title: "Gemüse-Snack", description: "Bereiten Sie Karotten- oder Selleriesticks als Snack vor" }
  },
  "38d688ce-9b7c-45e0-906d-a00bb69a7048": {
    es: { title: "Ensalada de entrada", description: "Empieza tu comida con una ensalada pequeña" },
    en: { title: "Salad starter", description: "Start your meal with a small salad" },
    de: { title: "Salat als Vorspeise", description: "Beginnen Sie Ihre Mahlzeit mit einem kleinen Salat" }
  },

  // Dormir mejor
  "546c2025-f05a-41f3-b23a-c9eee5c621bc": {
    es: { title: "Rutina de sueño", description: "Ve a la cama a la misma hora esta noche" },
    en: { title: "Sleep routine", description: "Go to bed at the same time tonight" },
    de: { title: "Schlafroutine", description: "Gehen Sie heute Abend zur gleichen Zeit ins Bett" }
  },
  "4732bc2c-28c4-42fc-8df0-414bcf50d126": {
    es: { title: "Sin pantallas 1 hora antes", description: "Apaga todos los dispositivos 1 hora antes de dormir" },
    en: { title: "No screens 1 hour before", description: "Turn off all devices 1 hour before sleep" },
    de: { title: "Keine Bildschirme 1 Stunde vorher", description: "Schalten Sie alle Geräte 1 Stunde vor dem Schlafengehen aus" }
  },
  "f8441ac3-38f4-4d2a-a628-f470b8a8d819": {
    es: { title: "Té relajante", description: "Prepara una infusión relajante antes de dormir" },
    en: { title: "Relaxing tea", description: "Prepare a relaxing tea before sleep" },
    de: { title: "Entspannender Tee", description: "Bereiten Sie einen entspannenden Tee vor dem Schlafengehen vor" }
  },
  "cd9b2ab8-e13f-492e-8ef9-5f54a7b727c0": {
    es: { title: "Oscurece tu habitación", description: "Asegúrate de que tu cuarto esté completamente oscuro" },
    en: { title: "Darken your room", description: "Make sure your room is completely dark" },
    de: { title: "Verdunkeln Sie Ihr Zimmer", description: "Stellen Sie sicher, dass Ihr Zimmer vollständig dunkel ist" }
  },
  "f5d50683-7d44-4e9e-922e-3a76b026a45e": {
    es: { title: "Temperatura fresca", description: "Mantén tu habitación fresca (18-20°C)" },
    en: { title: "Cool temperature", description: "Keep your room cool (18-20°C)" },
    de: { title: "Kühle Temperatur", description: "Halten Sie Ihr Zimmer kühl (18-20°C)" }
  },

  // Eliminar estrés
  "eab559a6-77df-40da-b877-efe06e642816": {
    es: { title: "Desconecta 15 minutos", description: "Apaga el teléfono y descansa 15 minutos" },
    en: { title: "Disconnect 15 minutes", description: "Turn off your phone and rest for 15 minutes" },
    de: { title: "15 Minuten abschalten", description: "Schalten Sie Ihr Telefon aus und ruhen Sie sich 15 Minuten aus" }
  },
  "f5f8d115-d2d6-47eb-9fe1-f4ff434099de": {
    es: { title: "Meditación 5 minutos", description: "Practica 5 minutos de meditación guiada" },
    en: { title: "5-minute meditation", description: "Practice 5 minutes of guided meditation" },
    de: { title: "5 Minuten Meditation", description: "Üben Sie 5 Minuten geführte Meditation" }
  },
  "25b1c526-7405-4e94-b883-c4898477fddb": {
    es: { title: "Escribe 3 cosas positivas", description: "Anota 3 cosas buenas que te pasaron hoy" },
    en: { title: "Write 3 positive things", description: "Write down 3 good things that happened today" },
    de: { title: "Schreiben Sie 3 positive Dinge", description: "Schreiben Sie 3 gute Dinge auf, die heute passiert sind" }
  },
  "b7585f73-6441-4bec-b3e1-863436296842": {
    es: { title: "Respira 4-7-8", description: "Practica la técnica 4-7-8: inhala 4, retén 7, exhala 8" },
    en: { title: "Breathe 4-7-8", description: "Practice the 4-7-8 technique: inhale 4, hold 7, exhale 8" },
    de: { title: "Atmen Sie 4-7-8", description: "Üben Sie die 4-7-8-Technik: einatmen 4, halten 7, ausatmen 8" }
  },
  "17a3cf51-a551-4dee-adc8-beb800f5dabd": {
    es: { title: "Música relajante", description: "Escucha música tranquila durante 10 minutos" },
    en: { title: "Relaxing music", description: "Listen to calm music for 10 minutes" },
    de: { title: "Entspannende Musik", description: "Hören Sie 10 Minuten lang ruhige Musik" }
  },

  // Mejorar el medio ambiente
  "a5e3f0b1-2c4d-4e5f-a6b7-8c9d0e1f2a3b": {
    es: { title: "Lleva tu bolsa", description: "Usa tu propia bolsa reutilizable para las compras" },
    en: { title: "Bring your bag", description: "Use your own reusable bag for shopping" },
    de: { title: "Bringen Sie Ihre Tasche mit", description: "Verwenden Sie Ihre eigene wiederverwendbare Tasche zum Einkaufen" }
  },
  "b6f4a1c2-3d5e-4f6a-b7c8-9d0e1f2a3b4c": {
    es: { title: "Desconecta aparatos", description: "Desconecta los aparatos que no estés usando" },
    en: { title: "Unplug devices", description: "Unplug devices you're not using" },
    de: { title: "Geräte ausstecken", description: "Trennen Sie Geräte, die Sie nicht verwenden" }
  },
  "c7a5b2d3-4e6f-5a7b-c8d9-0e1f2a3b4c5d": {
    es: { title: "Ducha corta", description: "Reduce tu ducha en 2 minutos hoy" },
    en: { title: "Short shower", description: "Reduce your shower by 2 minutes today" },
    de: { title: "Kurze Dusche", description: "Verkürzen Sie Ihre Dusche heute um 2 Minuten" }
  },
  "d8b6c3e4-5f7a-6b8c-d9e0-1f2a3b4c5d6e": {
    es: { title: "Recicla correctamente", description: "Separa tu basura en reciclaje, orgánico y general" },
    en: { title: "Recycle properly", description: "Separate your waste into recycling, organic and general" },
    de: { title: "Richtig recyceln", description: "Trennen Sie Ihren Müll in Recycling, organisch und allgemein" }
  },
  "e9c7d4f5-6a8b-7c9d-e0f1-2a3b4c5d6e7f": {
    es: { title: "Transporte sostenible", description: "Usa bicicleta, camina o transporte público hoy" },
    en: { title: "Sustainable transport", description: "Use bike, walk or public transport today" },
    de: { title: "Nachhaltiger Transport", description: "Nutzen Sie heute Fahrrad, gehen Sie zu Fuß oder nutzen Sie öffentliche Verkehrsmittel" }
  },

  // Reducir uso de pantallas
  "f0d8e5a6-7b9c-8d0e-f1a2-3b4c5d6e7f8a": {
    es: { title: "Sin teléfono en comidas", description: "Guarda el teléfono durante las comidas" },
    en: { title: "No phone during meals", description: "Put away your phone during meals" },
    de: { title: "Kein Telefon beim Essen", description: "Legen Sie Ihr Telefon während der Mahlzeiten weg" }
  },
  "a1e9f6b7-8c0d-9e1f-a2b3-4c5d6e7f8a9b": {
    es: { title: "Lee 15 minutos", description: "Lee un libro físico durante 15 minutos" },
    en: { title: "Read 15 minutes", description: "Read a physical book for 15 minutes" },
    de: { title: "15 Minuten lesen", description: "Lesen Sie 15 Minuten lang ein physisches Buch" }
  },
  "b2f0a7c8-9d1e-0f2a-b3c4-5d6e7f8a9b0c": {
    es: { title: "Modo avión 1 hora", description: "Activa modo avión durante 1 hora" },
    en: { title: "Airplane mode 1 hour", description: "Turn on airplane mode for 1 hour" },
    de: { title: "Flugmodus 1 Stunde", description: "Aktivieren Sie den Flugmodus für 1 Stunde" }
  },
  "c3a1b8d9-0e2f-1a3b-c4d5-6e7f8a9b0c1d": {
    es: { title: "Paseo sin móvil", description: "Sal a caminar 20 minutos sin tu teléfono" },
    en: { title: "Walk without phone", description: "Go for a 20-minute walk without your phone" },
    de: { title: "Spaziergang ohne Telefon", description: "Machen Sie einen 20-minütigen Spaziergang ohne Ihr Telefon" }
  },
  "d4b2c9e0-1f3a-2b4c-d5e6-7f8a9b0c1d2e": {
    es: { title: "Desactiva notificaciones", description: "Silencia las notificaciones de redes sociales hoy" },
    en: { title: "Disable notifications", description: "Silence social media notifications today" },
    de: { title: "Benachrichtigungen deaktivieren", description: "Stummschalten Sie heute Social-Media-Benachrichtigungen" }
  }
};

export const getTaskTranslation = (taskId: string, locale: string = 'es'): TaskTranslation | null => {
  const task = TASK_TRANSLATIONS[taskId];
  if (!task) return null;
  return task[locale] || task.es;
};
