export default class ApiResponse {

    static success(data, message = "OK") {

        return {

            success: true,

            message,

            data

        };

    }

    static error(error) {

        return {

            success: false,

            error

        };

    }

}