export default defineAppConfig({
  docus: {
    title: 'Velclaw',
    description:
      'Official documentation for the Velclaw open-source developer and AI infrastructure platform.',
    url: 'https://docs.velclaw.ai',
    image: '/velclaw-social.svg',
    socials: {
      github: 'Velclaw/velclaw'
    },
    header: {
      title: false,
      logo: true,
      showLinkIcon: true,
      fluid: true
    },
    main: {
      fluid: true,
      padded: true
    },
    footer: {
      credits: {
        icon: '',
        text: 'VELCLAW · Open-source engineering infrastructure',
        href: 'https://github.com/Velclaw/velclaw'
      },
      textLinks: [
        {
          text: 'Ecosystem',
          href: '/en/ecosystem'
        },
        {
          text: 'Contributing',
          href: '/en/contributing'
        },
        {
          text: 'GitHub',
          href: 'https://github.com/Velclaw/velclaw',
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      ]
    }
  },
  ui: {
    colors: {
      primary: 'violet',
      neutral: 'zinc'
    }
  }
})
