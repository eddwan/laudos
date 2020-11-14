import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { I18n } from 'aws-amplify';
import { FormFieldTypes } from '@aws-amplify/ui-components';

@Component({
    selector: 'app-user-authentication',
    templateUrl: './user-authentication.component.html',
    styleUrls: ['./user-authentication.component.scss']
})
export class UserAuthenticationComponent {
    formFields: FormFieldTypes;

    constructor( private router: Router, private authService:AuthService) {
        const dict = {
            'pt-br': {
                'Sign In': "Entrar",
                'Sign Up': "Cadastre-se",
                'Sign Out': "Desconectar",
                'Forgot your password?': "Esqueceu sua senha?",
                'Reset password': "Redefinir a senha",
                'Username': "Usuário",
                'Username *': "Usuário *",
                'Enter your username': "Digite seu email",
                'Enter your email address': "Digite seu email",
                'Enter your password': "Digite sua senha",
                'Password': "Senha",
                'Password *': "Senha *",
                'No account?': "Não tem uma conta?",
                'Create account': "Criar conta",
                'Change Password': "Alterar a senha",
                'New Password': "Nova senha",
                'Email': "Email",
                'Email Address *': "Email *",
                'Phone Number': "Número de telefone",
                'Phone Number *': "Número de telefone *",
                '(555) 555-1212': "(21) 98844-5566",
                '+1': "+55",
                'Have an account?':"Tem uma conta?",
                'Sign in': "Faça login",
                'Confirm a Code': "Confirmar o código",
                'Confirm Sign In': "Confirmar inicio da sessão",
                'Confirm Sign Up': "Confirmar Cadastro",
                'Back to Sign In': "Voltar a tela de login",
                'Send Code': "Enviar código",
                'Confirm': "Confirmar",
                'Create a new account': "Criar uma nova conta",
                'Create Account': "Criar conta",
                'Resend a Code': "Reenviar um código",
                'Submit': "Enviar",
                'Skip': "Pular",
                'Verify': "Verificar",
                'Verify Contact': "Verificar contato",
                'Code': "Código",
                'Confirmation Code': "Código de Confirmação",
                'Enter your code': "Digite o código do e-mail",
                'Lost your code?': "Perdeu o código?",
                'Resend Code': "Reenviar o código",
                'Confirm Sign up': "Confirmar o seu Cadastro",
                'Account recovery requires verified contact information': "A recuperação da conta requer informações de contato verificadas",
                'User does not exist': "o usuário não existe",
                'User already exists': "O usuário já existe",
                'Incorrect username or password': "Usuário ou senha incorretos",
                'Invalid password format': "Formato de senha inválido",
                'Invalid phone number format': "Formato de número de telefone inválido. Utilize o formato +552198888-7777",
                'Hello, {{username}}': "Olá, {{username}}",
                'Reset your password': "Redefina sua senha",
                'Sign in to your account': "Faça login com sua conta"
            }
        };
        
        I18n.putVocabularies(dict);
        I18n.setLanguage('pt-br');

        this.formFields = [
            {
                type: "email"
            },
            {
                type: "password"
            },
            {
                type: "phone_number"
            },
            {
              type: "name",
              label: "Nome completo *",
              placeholder: "Digite seu nome completo",
              required: false,
            }
          ];
    }
    
}