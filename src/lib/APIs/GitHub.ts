import { bind } from 'decko'

/**
 * communication between Aionic and GitHub developer API
 *
 * https://developer.github.com/
 */

export class GitHubApi {
  private url: string = 'https://api.github.com'

  /**
   * get repositories from an organization
   *
   * @param {string} organization
   * @returns {Promise<Array<object>>}
   */
  @bind
  public async getOrganizationRepos(organization: string): Promise<Array<object>> {
    return new Array()
  }

  /**
   * get commits from an branch
   *
   * @param {string} branch
   * @returns {Promise<Array<object>>}
   */
  @bind
  public async getBranchCommits(branch: string): Promise<Array<object>> {
    return new Array()
  }
}
