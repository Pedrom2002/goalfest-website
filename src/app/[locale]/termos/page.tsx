import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { BASE_URL } from '@/lib/constants'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const dynamicParams = false

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt ? 'Termos e Condições' : 'Terms & Conditions',
    description: isPt
      ? 'Termos e condições de utilização do Goalfest Lisboa 2026.'
      : 'Terms and conditions for using Goalfest Lisboa 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/termos`,
    },
    robots: { index: false },
  }
}

export default async function TermosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const isPt = locale === 'pt'

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-green-pt/40" />
            <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">Legal</p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-text-primary uppercase tracking-wide mb-2">
            {isPt ? 'Termos e Condições' : 'Terms & Conditions'}
          </h1>
          <p className="text-text-muted/50 text-xs">
            {isPt ? 'Atualizados em 13 de maio de 2026' : 'Updated on 13 May 2026'}
          </p>
        </div>

        <div className="space-y-8 text-text-muted leading-relaxed text-sm">

          <p>
            {isPt
              ? 'Ao utilizar os serviços oferecidos por este site, concorda em ficar vinculado aos presentes Termos e Condições. Por favor, leia atentamente antes de prosseguir.'
              : 'By using the services offered by this site, you agree to be bound by these Terms and Conditions. Please read carefully before proceeding.'}
          </p>

          {[
            {
              title: isPt ? '1. Definições' : '1. Definitions',
              items: [
                isPt ? '"Utilizador" refere-se a qualquer pessoa que aceda ou utilize os serviços do site Goalfest Lisboa 2026.' : '"User" refers to any person who accesses or uses the Goalfest Lisboa 2026 website services.',
                isPt ? '"Conteúdo" abrange qualquer informação, dados, texto, fotografias, gráficos, vídeos ou outros materiais publicados no site.' : '"Content" encompasses any information, data, text, photographs, graphics, videos or other materials published on the site.',
                isPt ? '"Evento" refere-se ao Goalfest Lisboa 2026, organizado pela QUIC NATION, Lda.' : '"Event" refers to Goalfest Lisboa 2026, organised by QUIC NATION, Lda.',
              ],
            },
            {
              title: isPt ? '2. Utilização Responsável' : '2. Responsible Use',
              items: [
                isPt ? 'O utilizador compromete-se a respeitar outros utilizadores e a não violar direitos de autor ou de propriedade intelectual.' : 'The user agrees to respect other users and not to violate copyright or intellectual property rights.',
                isPt ? 'É proibido publicar, transmitir ou distribuir conteúdo ofensivo, difamatório, obsceno ou ilegal.' : 'It is prohibited to publish, transmit or distribute offensive, defamatory, obscene or illegal content.',
              ],
            },
            {
              title: isPt ? '3. Direitos de Propriedade Intelectual' : '3. Intellectual Property Rights',
              items: [
                isPt ? 'Todo o conteúdo presente neste site, incluindo texto, gráficos, logótipos, ícones e imagens, é propriedade exclusiva da QUIC NATION, Lda e está protegido por direitos de autor.' : 'All content on this site, including text, graphics, logos, icons and images, is the exclusive property of QUIC NATION, Lda and is protected by copyright.',
              ],
            },
            {
              title: isPt ? '4. Privacidade' : '4. Privacy',
              items: [
                isPt ? 'A QUIC NATION, Lda respeita a privacidade dos seus utilizadores e protege as informações de acordo com a Política de Privacidade integrada neste site.' : 'QUIC NATION, Lda respects the privacy of its users and protects information in accordance with the Privacy Policy integrated into this site.',
              ],
            },
            {
              title: isPt ? '5. Bilhetes e Acesso ao Evento' : '5. Tickets and Event Access',
              items: [
                isPt ? 'A entrada geral no recinto Goalfest é gratuita.' : 'General admission to the Goalfest venue is free.',
                isPt ? 'O acesso ao Golden Circle é pago e sujeito a disponibilidade. A QUIC NATION, Lda reserva-se o direito de alterar condições de acesso.' : 'Access to the Golden Circle is paid and subject to availability. QUIC NATION, Lda reserves the right to change access conditions.',
                isPt ? 'O VIP Lounge é exclusivo por convite e não está disponível para venda ao público.' : 'The VIP Lounge is invite-only and is not available for public purchase.',
                isPt ? 'A QUIC NATION, Lda reserva-se o direito de recusar entrada a qualquer pessoa que não cumpra as regras do recinto.' : 'QUIC NATION, Lda reserves the right to refuse entry to anyone who does not comply with venue rules.',
              ],
            },
            {
              title: isPt ? '6. Limitação de Responsabilidade' : '6. Limitation of Liability',
              items: [
                isPt ? 'A QUIC NATION, Lda não será responsável por quaisquer danos diretos, indiretos, acidentais ou consequentes resultantes do uso ou incapacidade de usar os serviços do site ou do evento.' : 'QUIC NATION, Lda shall not be liable for any direct, indirect, incidental or consequential damages resulting from the use or inability to use the site services or the event.',
                isPt ? 'A programação do evento (jogos, concertos, atividades) está sujeita a alterações sem aviso prévio.' : 'The event programme (matches, concerts, activities) is subject to change without prior notice.',
              ],
            },
            {
              title: isPt ? '7. Alterações aos Termos' : '7. Changes to Terms',
              items: [
                isPt ? 'A QUIC NATION, Lda reserva-se o direito de atualizar estes Termos e Condições periodicamente. Os utilizadores serão notificados sobre quaisquer alterações significativas.' : 'QUIC NATION, Lda reserves the right to update these Terms and Conditions periodically. Users will be notified of any significant changes.',
              ],
            },
            {
              title: isPt ? '8. Lei Aplicável e Jurisdição' : '8. Applicable Law and Jurisdiction',
              items: [
                isPt ? 'Os presentes Termos e Condições são regidos pelas leis de Portugal. Qualquer disputa será sujeita à jurisdição dos tribunais competentes portugueses.' : 'These Terms and Conditions are governed by the laws of Portugal. Any dispute shall be subject to the jurisdiction of the competent Portuguese courts.',
              ],
            },
          ].map((section) => (
            <section key={section.title}>
              <h2 className="text-green-pt font-semibold text-xs uppercase tracking-wider mb-3">{section.title}</h2>
              <ul className="space-y-2 list-disc list-inside">
                {section.items.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            </section>
          ))}

          <section>
            <h2 className="text-green-pt font-semibold text-xs uppercase tracking-wider mb-3">
              {isPt ? '9. Contacto' : '9. Contact'}
            </h2>
            <p>{isPt ? 'Para dúvidas sobre estes Termos e Condições, contacte-nos através de ' : 'For questions about these Terms and Conditions, contact us at '}
              <a href="mailto:info@quic.pt" className="text-green-pt hover:underline">info@quic.pt</a>.
            </p>
          </section>

          <div className="border-t border-white/10 pt-6 text-xs text-text-muted/40">
            {isPt ? 'QUIC NATION, Lda · Termos atualizados a 13 de maio de 2026' : 'QUIC NATION, Lda · Terms updated 13 May 2026'}
          </div>
        </div>

        <div className="mt-10 flex gap-6">
          <Link href={`/${locale}`} className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors">
            ← {isPt ? 'Início' : 'Home'}
          </Link>
          <Link href={`/${locale}/privacidade`} className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors">
            {isPt ? 'Política de Privacidade →' : 'Privacy Policy →'}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
}
