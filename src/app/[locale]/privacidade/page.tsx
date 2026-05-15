import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'

const BASE_URL = 'https://goalfest.pt'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isPt = locale === 'pt'

  return {
    title: isPt ? 'Política de Privacidade' : 'Privacy Policy',
    description: isPt
      ? 'Política de privacidade do Goalfest Lisboa 2026.'
      : 'Privacy policy for Goalfest Lisboa 2026.',
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacidade`,
    },
    robots: { index: false },
  }
}

export default async function PrivacidadePage({
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
      <main className="min-h-screen pt-24 pb-20 px-4 max-w-3xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-green-pt/40" />
            <p className="text-green-pt text-xs uppercase tracking-[0.3em] font-medium">Legal</p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-black text-text-primary uppercase tracking-wide mb-2">
            {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
          </h1>
          <p className="text-text-muted/50 text-xs">
            {isPt ? 'Atualizado em 13 de maio de 2026' : 'Updated on 13 May 2026'}
          </p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-text-muted leading-relaxed">

          <p>
            {isPt
              ? 'A presente Política de Privacidade descreve como a QUIC NATION, Lda recolhe, utiliza e protege as informações dos utilizadores do site Goalfest Lisboa 2026. Ao utilizar os nossos serviços, concorda com os termos desta política.'
              : 'This Privacy Policy describes how QUIC NATION, Lda collects, uses and protects the information of users of the Goalfest Lisboa 2026 website. By using our services, you agree to the terms of this policy.'}
          </p>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '1. Informações Recolhidas' : '1. Information Collected'}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-text-primary">{isPt ? 'Dados de contacto:' : 'Contact data:'}</strong> {isPt ? 'Quando nos contacta por email, recolhemos nome e endereço de e-mail.' : 'When you contact us by email, we collect your name and email address.'}</li>
              <li><strong className="text-text-primary">{isPt ? 'Preferências:' : 'Preferences:'}</strong> {isPt ? 'Podemos recolher informações sobre as suas preferências para personalizar a experiência no site.' : 'We may collect information about your preferences to personalise your experience on the site.'}</li>
              <li><strong className="text-text-primary">{isPt ? 'Comunicações:' : 'Communications:'}</strong> {isPt ? 'Registamos comunicações com o nosso site, incluindo mensagens de suporte e feedback.' : 'We record communications with our site, including support messages and feedback.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '2. Utilização das Informações' : '2. Use of Information'}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>{isPt ? 'Melhorar a experiência do utilizador e personalizar conteúdos.' : 'Improve user experience and personalise content.'}</li>
              <li>{isPt ? 'Enviar comunicações sobre o evento, novidades e informações relevantes. O seu endereço de e-mail não será utilizado para fins alheios à promoção das atividades da QUIC NATION, Lda.' : 'Send communications about the event, news and relevant information. Your email address will not be used for purposes unrelated to the promotion of QUIC NATION, Lda activities.'}</li>
              <li>{isPt ? 'Responder a pedidos de suporte e assistência.' : 'Respond to support and assistance requests.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '3. Proteção de Dados' : '3. Data Protection'}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>{isPt ? 'Implementamos medidas de segurança para proteger as suas informações contra acesso não autorizado ou divulgação.' : 'We implement security measures to protect your information against unauthorised access or disclosure.'}</li>
              <li>{isPt ? 'Apenas funcionários autorizados têm acesso às informações dos utilizadores, estritamente no âmbito deste site.' : 'Only authorised staff have access to user information, strictly within the scope of this site.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '4. Partilha de Informações' : '4. Sharing of Information'}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>{isPt ? 'Podemos partilhar informações com terceiros de confiança estritamente para fornecimento de serviços essenciais ao funcionamento do site.' : 'We may share information with trusted third parties strictly for the provision of services essential to the operation of the site.'}</li>
              <li>{isPt ? 'Em certas circunstâncias, podemos ser obrigados a divulgar informações em conformidade com a legislação aplicável.' : 'In certain circumstances, we may be required to disclose information in accordance with applicable legislation.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '5. Cookies' : '5. Cookies'}
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>{isPt ? 'Utilizamos cookies e tecnologias semelhantes para melhorar a experiência do utilizador e personalizar conteúdos.' : 'We use cookies and similar technologies to improve user experience and personalise content.'}</li>
              <li>{isPt ? 'Os utilizadores podem aceitar ou recusar cookies através das configurações do navegador.' : 'Users can accept or refuse cookies through their browser settings.'}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '6. Alterações à Política' : '6. Policy Changes'}
            </h2>
            <p>{isPt ? 'Reservamo-nos o direito de atualizar esta Política de Privacidade periodicamente. Os utilizadores serão informados sobre quaisquer alterações significativas.' : 'We reserve the right to update this Privacy Policy periodically. Users will be informed of any significant changes.'}</p>
          </section>

          <section>
            <h2 className="text-text-primary font-semibold text-sm uppercase tracking-wider mb-3 text-green-pt">
              {isPt ? '7. Contacto' : '7. Contact'}
            </h2>
            <p>{isPt ? 'Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento dos seus dados, contacte-nos através de ' : 'For questions about this Privacy Policy or how we handle your data, contact us at '}
              <a href="mailto:info@quic.pt" className="text-green-pt hover:underline">info@quic.pt</a>.
            </p>
          </section>

          <div className="border-t border-white/10 pt-6 text-xs text-text-muted/40">
            {isPt ? 'QUIC NATION, Lda · Política atualizada a 13 de maio de 2026' : 'QUIC NATION, Lda · Policy updated 13 May 2026'}
          </div>
        </div>

        <div className="mt-10 flex gap-6">
          <Link href={`/${locale}`} className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors">
            ← {isPt ? 'Início' : 'Home'}
          </Link>
          <Link href={`/${locale}/termos`} className="text-text-muted/50 text-xs uppercase tracking-widest hover:text-green-pt transition-colors">
            {isPt ? 'Termos e Condições →' : 'Terms & Conditions →'}
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
