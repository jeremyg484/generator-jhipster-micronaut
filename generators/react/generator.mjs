import BaseApplicationGenerator from 'generator-jhipster/generators/base-application';

export default class extends BaseApplicationGenerator {
  constructor(args, opts, features) {
    super(args, opts, { ...features, sbsBlueprint: true });
  }

  get [BaseApplicationGenerator.POST_WRITING]() {
    return this.asPostWritingTaskGroup({
      customizeReactForMicronaut({ application: { clientFrameworkReact, authenticationTypeJwt, authenticationTypeOauth2 } }) {
        if (!clientFrameworkReact) return;

        // Update home with mhipster
        this.editFile('src/main/webapp/app/modules/home/home.tsx', content =>
          content
            .replaceAll('https://github.com/jhipster/generator-jhipster', 'https://github.com/jhipster/generator-jhipster-micronaut')
            .replace('If you like JHipster', 'If you like MHipster')
            .replace('JHipster bug tracker', 'MHipster bug tracker')
            .replace('If you have any question on JHipster', 'If you have any question on JHipster or MHipster'),
        );

        // health api
        this.editFile('src/main/webapp/app/modules/administration/health/health.tsx', content =>
          content.replaceAll('components', 'details'),
        );

        // active-profiles api
        this.editFile('src/main/webapp/app/shared/reducers/application-profile.ts', content =>
          content.replaceAll('.activeProfiles', "['active-profiles']"),
        );
        this.editFile('src/main/webapp/app/shared/reducers/application-profile.spec.ts', content =>
          content.replaceAll('activeProfiles', "['active-profiles']"),
        );
        this.editFile('src/main/webapp/app/modules/administration/administration.reducer.spec.ts', content =>
          content.replaceAll('activeProfiles', "['active-profiles']"),
        );

        if (authenticationTypeJwt) {
          // authentication api
          this.editFile('src/main/webapp/app/shared/reducers/authentication.spec.ts', content =>
            content.replaceAll("headers: { authorization: 'Bearer ", "data: { access_token: '"),
          );
          this.editFile('src/main/webapp/app/shared/reducers/authentication.ts', content =>
            content
              .replace('const bearerToken = response?.headers?.authorization;', 'const jwt = response?.data?.access_token;')
              .replace("bearerToken && bearerToken.slice(0, 7) === 'Bearer '", 'jwt')
              .replace('const jwt = bearerToken.slice(7, bearerToken.length);', ''),
          );
        }
      },
    });
  }
}
