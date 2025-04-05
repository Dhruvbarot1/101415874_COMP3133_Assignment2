import { enableProdMode, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app/app/app.component';
import { appRoutes } from './app/app/app.routes';

import { provideApollo } from 'apollo-angular';
import { InMemoryCache, ApolloClientOptions } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    provideRouter(appRoutes),

    // ✅ Use Angular's built-in inject() function to get HttpLink
    provideApollo((): ApolloClientOptions<any> => {
      const httpLink = inject(HttpLink);
      return {
        cache: new InMemoryCache(),
        link: httpLink.create({ uri: 'http://localhost:4000/graphql' }),
      };
    }),
  ],
}).catch(err => console.error(err));
